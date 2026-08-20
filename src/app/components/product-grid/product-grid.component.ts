import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductsService } from '../../core/products.service';
import { Product } from '../../models/catalog.models';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [ProductCardComponent, RouterLink],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.css',
})
export class ProductGridComponent implements OnInit {
  products: Product[] = [];

  constructor(private readonly productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.list({ featured: true }).subscribe((products) => (this.products = products));
  }
}
