import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  scrollToFeatured(): void {
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
  }
}
