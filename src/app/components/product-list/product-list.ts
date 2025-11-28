import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductCard, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private readonly productService = inject(ProductService);

  products = signal<Product[]>([]);
  categories = signal<string[]>([]);
  selectedCategory = signal<string>('all');
  currentPage = signal<number>(0);
  pageSize = signal<number>(8);
  totalElements = signal<number>(0);
  totalPages = signal<number>(0);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadData();
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  loadData(): void {
    this.isLoading.set(true);
    
    this.productService.getProducts(
      this.currentPage(), 
      this.pageSize(), 
      this.searchQuery(),
      this.selectedCategory()
    ).subscribe({
      next: (response) => {
        this.products.set(response.content);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('API Error: ', error);
        this.errorMessage.set('Failed to load products.');
        this.isLoading.set(false);
      },
    });
  }

  onSearch() {
    this.currentPage.set(0);
    this.loadData();
  }

  setCategory(category: string) {
    this.selectedCategory.set(category);
    this.currentPage.set(0);
    this.loadData();
  }

  clearSearch() {
    this.searchQuery.set('');
    this.currentPage.set(0);
    this.loadData();
  }

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(p => p + 1);
      this.loadData();
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.loadData();
    }
  }
}