import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { PRODUCTS } from '../../data/catalog.data';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.css',
})
export class ProductGridComponent {
  products = PRODUCTS;
  private addedSkus = new Set<string>();

  ratingDots(rating: number): boolean[] {
    return [0, 1, 2].map((i) => i < rating);
  }

  isAdded(sku: string): boolean {
    return this.addedSkus.has(sku);
  }

  addToCart(sku: string): void {
    this.addedSkus.add(sku);
  }
}
