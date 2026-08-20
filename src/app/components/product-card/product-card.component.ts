import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { CartService } from '../../core/cart.service';
import { Product } from '../../models/catalog.models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [IconComponent, NgClass],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  justAdded = false;

  constructor(
    private readonly router: Router,
    private readonly cartService: CartService,
  ) {}

  ratingDots(rating: number): boolean[] {
    return [0, 1, 2].map((i) => i < rating);
  }

  goToDetail(): void {
    this.router.navigate(['/product', this.product.sku]);
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.cartService.add(this.product);
    this.justAdded = true;
    setTimeout(() => (this.justAdded = false), 1200);
  }
}
