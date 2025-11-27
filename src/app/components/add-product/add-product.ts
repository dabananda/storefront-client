import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);

  categories = signal<string[]>([]);
  isSubmitting = signal(false);
  successMessage = signal<string | null>(null);

  ngOnInit() {
    this.productService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Failed to load categories', err),
    });
  }

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    imageUrl: [this.productService.defaultProductImage, Validators.required],
  });

  onSubmit() {
    if (this.productForm.valid) {
      this.isSubmitting.set(true);

      this.productService.addProduct(this.productForm.value as any).subscribe({
        next: (res) => {
          console.log('Product added:', res);
          this.isSubmitting.set(false);
          this.successMessage.set('Product added successfully!');
          this.productForm.reset();
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting.set(false);
        },
      });
    }
  }
}
