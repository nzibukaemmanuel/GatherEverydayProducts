import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, AuthUser } from '../../core/auth.service';
import { CartItem, CartService } from '../../core/cart.service';
import { OrdersService } from '../../core/orders.service';

const SHIPPING_FEE = 6;
const FREE_SHIPPING_THRESHOLD = 75;

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css',
})
export class CheckoutPageComponent {
  readonly currentUser$: Observable<AuthUser | null>;
  items: CartItem[] = [];
  submitting = false;
  errorMessage: string | null = null;

  shippingForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    postal: ['', Validators.required],
    country: ['', Validators.required],
  });

  paymentForm = this.fb.group({
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{13,19}$/)]],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly cartService: CartService,
    private readonly authService: AuthService,
    private readonly ordersService: OrdersService,
    private readonly router: Router,
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.items = this.cartService.items;
    this.currentUser$.subscribe((user) => {
      if (user) {
        this.shippingForm.get('email')?.clearValidators();
        this.shippingForm.get('email')?.updateValueAndValidity();
      }
    });
  }

  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  get shippingFee(): number {
    return this.subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  }

  get total(): number {
    return this.subtotal + this.shippingFee;
  }

  submit(): void {
    if (this.shippingForm.invalid || this.paymentForm.invalid || this.items.length === 0) {
      this.shippingForm.markAllAsTouched();
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    const shipping = this.shippingForm.value;
    const isGuest = !this.authService.token;

    // Payment is mocked for this demo — simulate processing latency before "charging."
    setTimeout(() => {
      this.ordersService
        .create({
          items: this.items.map((item) => ({ sku: item.sku, qty: item.qty })),
          shipping: {
            name: shipping.name!,
            address: shipping.address!,
            city: shipping.city!,
            postal: shipping.postal!,
            country: shipping.country!,
          },
          ...(isGuest ? { guestEmail: shipping.email! } : {}),
        })
        .subscribe({
          next: (order) => {
            this.cartService.clear();
            this.router.navigate(['/order-confirmation', order.id]);
          },
          error: (err) => {
            this.submitting = false;
            this.errorMessage = err.error?.message || 'Something went wrong placing your order.';
          },
        });
    }, 900);
  }
}
