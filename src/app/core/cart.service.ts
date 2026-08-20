import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/catalog.models';

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  icon: string;
  tint: Product['tint'];
  qty: number;
}

const STORAGE_KEY = 'gather-cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.readStored());
  readonly items$ = this.itemsSubject.asObservable();

  readonly totalCount$ = this.items$.pipe(map((items) => items.reduce((n, item) => n + item.qty, 0)));
  readonly subtotal$ = this.items$.pipe(map((items) => items.reduce((sum, item) => sum + item.price * item.qty, 0)));

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  add(product: Product, qty = 1): void {
    const items = [...this.itemsSubject.value];
    const existing = items.find((item) => item.sku === product.sku);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        sku: product.sku,
        name: product.name,
        price: product.price,
        icon: product.icon,
        tint: product.tint,
        qty,
      });
    }
    this.update(items);
  }

  setQty(sku: string, qty: number): void {
    if (qty <= 0) {
      this.remove(sku);
      return;
    }
    this.update(this.itemsSubject.value.map((item) => (item.sku === sku ? { ...item, qty } : item)));
  }

  remove(sku: string): void {
    this.update(this.itemsSubject.value.filter((item) => item.sku !== sku));
  }

  clear(): void {
    this.update([]);
  }

  private update(items: CartItem[]): void {
    this.itemsSubject.next(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  private readStored(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }
}
