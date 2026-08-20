import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { ProductsService } from '../../core/products.service';
import { Category } from '../../models/catalog.models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [NgClass, IconComponent, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(private readonly productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.listCategories().subscribe((categories) => (this.categories = categories));
  }
}
