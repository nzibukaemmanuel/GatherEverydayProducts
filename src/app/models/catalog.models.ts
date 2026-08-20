export type Tint = 'accent' | 'teal' | 'sand';

export interface Category {
  name: string;
  icon: string;
  tint: Tint;
}

export interface MenuSection {
  name: string;
  icon: string;
  /** Sub-links shown in the dropdown; omit for a plain top-level link. */
  links?: string[];
}

export interface Product {
  sku: string;
  name: string;
  price: number;
  icon: string;
  tint: Tint;
  badge?: string;
  /** rating shown as 0–3 filled dots, matching the design's simplified rating device */
  rating: number;
}
