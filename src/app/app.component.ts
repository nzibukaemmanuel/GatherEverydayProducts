import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { PromoBannerComponent } from './components/promo-banner/promo-banner.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    CategoriesComponent,
    ProductGridComponent,
    PromoBannerComponent,
    NewsletterComponent,
    FooterComponent,
    AuthModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protoBannerVisible = true;

  dismissBanner(): void {
    this.protoBannerVisible = false;
  }
}
