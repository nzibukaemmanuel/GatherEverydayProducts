import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ShippingDetails {
  name: string;
  address: string;
  city: string;
  postal: string;
  country: string;
}

export interface OrderItemInput {
  sku: string;
  qty: number;
}

export interface CreateOrderRequest {
  items: OrderItemInput[];
  shipping: ShippingDetails;
  guestEmail?: string;
}

export interface OrderItem {
  sku: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: number;
  user_id: number | null;
  guest_email: string | null;
  status: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal: string;
  shipping_country: string;
  created_at: string;
  items: OrderItem[];
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private readonly http: HttpClient) {}

  create(order: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/orders`, order);
  }

  getById(id: number | string): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${id}`);
  }
}
