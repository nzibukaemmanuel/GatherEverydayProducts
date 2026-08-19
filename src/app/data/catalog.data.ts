import { Category, Product } from '../models/catalog.models';

export const CATEGORIES: Category[] = [
  { name: 'Kitchen', icon: 'bowl', tint: 'teal' },
  { name: 'Living', icon: 'chair', tint: 'accent' },
  { name: 'Bath', icon: 'candle', tint: 'sand' },
  { name: 'Garden', icon: 'leaf', tint: 'teal' },
  { name: 'Desk', icon: 'lamp', tint: 'accent' },
];

export const PRODUCTS: Product[] = [
  {
    sku: 'GT-0142',
    name: 'Kessel Stoneware Mug',
    price: 24,
    icon: 'mug',
    tint: 'teal',
    badge: 'New',
    rating: 2,
  },
  {
    sku: 'GT-0087',
    name: 'Terra Planter, Small',
    price: 38,
    icon: 'plant',
    tint: 'accent',
    rating: 3,
  },
  {
    sku: 'GT-0203',
    name: 'Wick Table Lamp',
    price: 96,
    icon: 'lamp',
    tint: 'sand',
    badge: 'Bestseller',
    rating: 3,
  },
  { sku: 'GT-0056', name: 'Field Tote, Canvas', price: 52, icon: 'bag', tint: 'teal', rating: 1 },
  {
    sku: 'GT-0119',
    name: 'Ash Taper Candle Set',
    price: 19,
    icon: 'candle',
    tint: 'accent',
    rating: 2,
  },
  {
    sku: 'GT-0031',
    name: 'Hearth Serving Bowl',
    price: 44,
    icon: 'bowl',
    tint: 'sand',
    badge: 'New',
    rating: 3,
  },
];
