import { AsyncPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { CartDrawerService } from '../../core/cart-drawer.service';
import { CartItem, CartService } from '../../core/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [AsyncPipe, NgClass, IconComponent, RouterLink],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.css',
})
export class CartDrawerComponent {
  readonly open$ = this.cartDrawer.open$;
  readonly items$ = this.cartService.items$;
  readonly subtotal$ = this.cartService.subtotal$;

  constructor(
    private readonly cartDrawer: CartDrawerService,
    private readonly cartService: CartService,
  ) {}

  close(): void {
    this.cartDrawer.close();
  }

  changeQty(item: CartItem, delta: number): void {
    this.cartService.setQty(item.sku, item.qty + delta);
  }

  remove(sku: string): void {
    this.cartService.remove(sku);
  }
}
