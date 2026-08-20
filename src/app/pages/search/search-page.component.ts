import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductsService } from '../../core/products.service';
import { Product } from '../../models/catalog.models';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css',
})
export class SearchPageComponent implements OnInit {
  products: Product[] = [];
  query = '';
  loading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productsService: ProductsService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        switchMap((params) => {
          this.query = params.get('q') ?? '';
          this.loading = true;
          return this.productsService.list({ q: this.query });
        }),
      )
      .subscribe((products) => {
        this.products = products;
        this.loading = false;
      });
  }
}
