import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { CategoriesComponent } from '../../components/categories/categories.component';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';
import { PromoBannerComponent } from '../../components/promo-banner/promo-banner.component';
import { NewsletterComponent } from '../../components/newsletter/newsletter.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeroComponent, CategoriesComponent, ProductGridComponent, PromoBannerComponent, NewsletterComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {}
