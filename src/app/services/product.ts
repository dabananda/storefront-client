import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = 'http://localhost:8080/api/products';

  getProducts() {
    return this.http.get<Product[]>(this.apiUrl)
  }
}