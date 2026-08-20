import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { IconComponent } from '../../components/icon/icon.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CartDrawerService } from '../../core/cart-drawer.service';
import { CartService } from '../../core/cart.service';
import { ProductsService } from '../../core/products.service';
import { Product } from '../../models/catalog.models';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [NgClass, IconComponent, ProductCardComponent, RouterLink],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.css',
})
export class ProductDetailPageComponent implements OnInit {
  product: Product | null = null;
  related: Product[] = [];
  notFound = false;
  qty = 1;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productsService: ProductsService,
    private readonly cartService: CartService,
    private readonly cartDrawer: CartDrawerService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(switchMap((params) => this.productsService.getBySku(params.get('sku')!)))
      .subscribe({
        next: (product) => {
          this.product = product;
          this.notFound = false;
          this.qty = 1;
          if (product.category) {
            this.productsService.list({ category: product.category }).subscribe((products) => {
              this.related = products.filter((p) => p.sku !== product.sku).slice(0, 3);
            });
          }
        },
        error: () => {
          this.product = null;
          this.notFound = true;
        },
      });
  }

  ratingDots(rating: number): boolean[] {
    return [0, 1, 2].map((i) => i < rating);
  }

  changeQty(delta: number): void {
    this.qty = Math.max(1, this.qty + delta);
  }

  addToCart(): void {
    if (!this.product) return;
    this.cartService.add(this.product, this.qty);
    this.cartDrawer.open();
  }
}
