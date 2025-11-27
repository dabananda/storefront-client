import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';
import { ConfirmationModal } from '../confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-product-details',
  imports: [ConfirmationModal],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private productService = inject(ProductService);

  product = signal<Product | null>(null);
  isLoading = signal<boolean>(true);
  isDeleting = signal<boolean>(false);
  showDeleteModal = signal<boolean>(false);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.product.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
        },
      });
    }
  }

  goBack() {
    this.location.back();
  }

  openDeleteModal() {
    this.showDeleteModal.set(true);
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
  }

  confirmDelete() {
    const p = this.product();
    if (!p) return;

    this.showDeleteModal.set(false);
    this.isDeleting.set(true);

    this.productService.deleteProduct(p.id).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete product.');
        this.isDeleting.set(false);
      },
    });
  }
}
