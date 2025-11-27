import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
})
export class AddProduct implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categories = signal<string[]>([]);
  isSubmitting = signal(false);
  successMessage = signal<string | null>(null);

  isEditMode = signal(false);
  productId: number | null = null;

  productForm = this.fb.group({
    title: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    description: ['', Validators.required],
    image: [this.productService.defaultProductImage, Validators.required],
    category: ['', Validators.required],
  });

  ngOnInit() {
    this.productService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error(err),
    });

    // Check for Id in URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId = Number(id);
      this.loadProductData(this.productId);
    }
  }

  loadProductData(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          title: product.title,
          price: product.price,
          description: product.description,
          image: product.image,
          category: product.category,
        });
      },
      error: (err) => console.error('Failed to load product', err),
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isSubmitting.set(true);
      const productData = this.productForm.value;

      if (this.isEditMode() && this.productId) {
        this.productService.updateProduct(this.productId, productData).subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.successMessage.set('Product updated successfully!');
            setTimeout(() => this.router.navigate(['/products', this.productId]), 2500);
          },
          error: (err) => {
            console.error(err);
            this.isSubmitting.set(false);
          },
        });
      } else {
        this.productService.addProduct(productData as any).subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.successMessage.set('Product added successfully!');
            this.productForm.reset();
          },
          error: (err) => {
            console.error(err);
            this.isSubmitting.set(false);
          },
        });
      }
    }
  }
}
