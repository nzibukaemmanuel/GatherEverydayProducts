export type Tint = 'accent' | 'teal' | 'sand';

export interface Category {
  slug: string;
  name: string;
  icon: string;
  tint: Tint;
}

export interface MenuSection {
  name: string;
  icon: string;
  /** Sub-links shown in the dropdown; omit for a plain top-level link. */
  links?: string[];
  /** Category slug this section routes to; omit if there's no backing category yet. */
  categorySlug?: string;
}

export interface Product {
  sku: string;
  name: string;
  description?: string;
  price: number;
  icon: string;
  tint: Tint;
  badge?: string;
  /** rating shown as 0–3 filled dots, matching the design's simplified rating device */
  rating: number;
  /** category slug, present on products returned by the API */
  category?: string;
}
