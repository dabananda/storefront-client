import { Component, signal } from '@angular/core';
import { ProductList } from './components/product-list/product-list';
import { Navbar } from "./components/navbar/navbar";
import { Footer } from "./components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [ProductList, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('storefront-client');
}
