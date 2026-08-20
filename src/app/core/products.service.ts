import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, Product } from '../models/catalog.models';

export interface ProductFilter {
  category?: string;
  q?: string;
  badge?: string;
  featured?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private readonly http: HttpClient) {}

  list(filter: ProductFilter = {}): Observable<Product[]> {
    let params = new HttpParams();
    if (filter.category) params = params.set('category', filter.category);
    if (filter.q) params = params.set('q', filter.q);
    if (filter.badge) params = params.set('badge', filter.badge);
    if (filter.featured !== undefined) params = params.set('featured', String(filter.featured));
    return this.http.get<Product[]>(`${environment.apiUrl}/products`, { params });
  }

  getBySku(sku: string): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${sku}`);
  }

  listCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  }
}
