import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductsService } from '../../core/products.service';
import { Product } from '../../models/catalog.models';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.css',
})
export class ProductListPageComponent implements OnInit {
  products: Product[] = [];
  heading = 'All products';
  loading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productsService: ProductsService,
  ) {}

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.data])
      .pipe(
        switchMap(([params, data]) => {
          this.loading = true;
          const slug = params.get('slug');
          if (slug) {
            this.heading = capitalize(slug);
            return this.productsService.list({ category: slug });
          }
          if (data['badge']) {
            this.heading = 'New arrivals';
            return this.productsService.list({ badge: data['badge'] });
          }
          this.heading = 'All products';
          return this.productsService.list({});
        }),
      )
      .subscribe((products) => {
        this.products = products;
        this.loading = false;
      });
  }
}

function capitalize(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}
