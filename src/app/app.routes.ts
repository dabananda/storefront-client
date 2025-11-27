import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { ProductDetails } from './components/product-details/product-details';
import { AddProduct } from './components/add-product/add-product';

export const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'add-product', component: AddProduct },
  { path: 'edit-product/:id', component: AddProduct },
  { path: 'products/:id', component: ProductDetails },
  { path: '**', redirectTo: '' },
];
