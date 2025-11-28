import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/products';

  defaultProductImage =
    'https://res.cloudinary.com/djz3p8sux/image/upload/v1764239947/defaults/default_kfea56.png';

  getProducts(page: number, size: number, search: string = '', category: string = ''): Observable<PaginatedResponse> {
    let params = new HttpParams().set('page', page).set('size', size);
    
    if (search) params = params.set('search', search)
    if (category && category !== 'all') params = params.set('category', category);

    return this.http.get<PaginatedResponse>(this.apiUrl, { params });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: Partial<Product>) {
    return this.http.post<Product>(this.apiUrl, product);
  }

  deleteProduct(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: number, product: any) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }
}
