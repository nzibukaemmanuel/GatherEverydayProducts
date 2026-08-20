import { MenuSection } from '../models/catalog.models';

export const MENU_SECTIONS: MenuSection[] = [
  { name: 'New arrivals', icon: 'plant', categorySlug: 'new-arrivals' },
  {
    name: 'Kitchen',
    icon: 'bowl',
    categorySlug: 'kitchen',
    links: ['Cookware', 'Bakeware', 'Dinnerware', 'Drinkware', 'Kitchen storage', 'Utensils'],
  },
  {
    name: 'Living',
    icon: 'chair',
    categorySlug: 'living',
    links: ['Sofas & chairs', 'Coffee tables', 'Rugs', 'Wall decor', 'Bookshelves'],
  },
  {
    name: 'Bedroom',
    icon: 'candle',
    links: ['Bedding', 'Pillows & throws', 'Bed frames', 'Nightstands'],
  },
  {
    name: 'Bath',
    icon: 'candle',
    categorySlug: 'bath',
    links: ['Towels', 'Bath mats', 'Shower accessories', 'Bath storage'],
  },
  {
    name: 'Garden',
    icon: 'leaf',
    categorySlug: 'garden',
    links: ['Planters', 'Outdoor furniture', 'Garden tools', 'Outdoor lighting'],
  },
  {
    name: 'Desk & office',
    icon: 'lamp',
    categorySlug: 'desk',
    links: ['Desk lamps', 'Organizers', 'Office chairs', 'Stationery'],
  },
  {
    name: 'Storage & organization',
    icon: 'bag',
    links: ['Baskets', 'Shelving', 'Closet systems'],
  },
  {
    name: 'Lighting',
    icon: 'lamp',
    links: ['Table lamps', 'Floor lamps', 'Pendant lights', 'Candles'],
  },
  {
    name: 'Kids & pets',
    icon: 'bag',
    links: ['Kids decor', 'Pet beds', 'Toy storage'],
  },
  { name: 'Journal', icon: 'mug' },
  { name: 'Sale', icon: 'plus' },
  { name: 'Gift cards', icon: 'mail' },
];
