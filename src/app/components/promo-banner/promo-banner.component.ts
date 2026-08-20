import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-promo-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './promo-banner.component.html',
  styleUrl: './promo-banner.component.css',
})
export class PromoBannerComponent {}
