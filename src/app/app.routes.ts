import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { ProductListPageComponent } from './pages/product-list/product-list-page.component';
import { ProductDetailPageComponent } from './pages/product-detail/product-detail-page.component';
import { SearchPageComponent } from './pages/search/search-page.component';
import { CheckoutPageComponent } from './pages/checkout/checkout-page.component';
import { OrderConfirmationPageComponent } from './pages/order-confirmation/order-confirmation-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'category/:slug', component: ProductListPageComponent },
  { path: 'products', component: ProductListPageComponent },
  { path: 'new-arrivals', component: ProductListPageComponent, data: { badge: 'New' } },
  { path: 'product/:sku', component: ProductDetailPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'checkout', component: CheckoutPageComponent },
  { path: 'reset-password', component: HomePageComponent },
  { path: 'order-confirmation/:id', component: OrderConfirmationPageComponent },
  { path: '**', redirectTo: '' },
];
