import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { CATEGORIES } from '../../data/catalog.data';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  categories = CATEGORIES;
}
