import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private readonly productService = inject(ProductService);

  products = signal<Product[]>([]);
  categories = signal<string[]>([]);
  selectedCategory = signal<string>('all');

  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  filteredProducts = computed(() => {
    const category = this.selectedCategory();
    const allProducts = this.products();
    if (category === 'all') return allProducts;
    return allProducts.filter((product) => product.category === category);
  });

  private loadData(): void {
    // fetching products
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('API Error: ', error);
        this.errorMessage.set('Failed to load products. Please ensure the backend is running.');
        this.isLoading.set(false);
      },
    });

    // fetching categories
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (error) => {
        console.error('API Error: ', error);
        this.errorMessage.set('Failed to load categories. Please ensure the backend is running.');
      },
    });
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
