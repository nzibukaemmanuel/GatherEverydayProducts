import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(path.join(dataDir, 'gather.sqlite'));
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    tint TEXT NOT NULL CHECK (tint IN ('accent','teal','sand'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price REAL NOT NULL,
    icon TEXT NOT NULL,
    tint TEXT NOT NULL CHECK (tint IN ('accent','teal','sand')),
    badge TEXT,
    rating INTEGER NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 3),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0,1))
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    guest_email TEXT,
    status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('pending','paid','cancelled')),
    subtotal REAL NOT NULL,
    shipping_fee REAL NOT NULL DEFAULT 0,
    total REAL NOT NULL,
    shipping_name TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_postal TEXT NOT NULL,
    shipping_country TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    qty INTEGER NOT NULL CHECK (qty > 0)
  );
`);

const categoryCount = (db.prepare('SELECT COUNT(*) AS n FROM categories').get() as { n: number }).n;

if (categoryCount === 0) {
  const insertCategory = db.prepare(
    'INSERT INTO categories (slug, name, icon, tint) VALUES (@slug, @name, @icon, @tint)',
  );
  const categories = [
    { slug: 'kitchen', name: 'Kitchen', icon: 'bowl', tint: 'teal' },
    { slug: 'living', name: 'Living', icon: 'chair', tint: 'accent' },
    { slug: 'bath', name: 'Bath', icon: 'candle', tint: 'sand' },
    { slug: 'garden', name: 'Garden', icon: 'leaf', tint: 'teal' },
    { slug: 'desk', name: 'Desk', icon: 'lamp', tint: 'accent' },
  ];
  for (const category of categories) insertCategory.run(category);

  const categoryIdBySlug = new Map(
    (db.prepare('SELECT id, slug FROM categories').all() as { id: number; slug: string }[]).map((c) => [
      c.slug,
      c.id,
    ]),
  );

  const insertProduct = db.prepare(`
    INSERT INTO products (sku, name, description, price, icon, tint, badge, rating, category_id, featured)
    VALUES (@sku, @name, @description, @price, @icon, @tint, @badge, @rating, @categoryId, @featured)
  `);
  const products = [
    {
      sku: 'GT-0142',
      name: 'Kessel Stoneware Mug',
      description: 'A hand-glazed stoneware mug with a wide grip and a satisfying weight — built for everyday coffee, not the display shelf.',
      price: 24,
      icon: 'mug',
      tint: 'teal',
      badge: 'New',
      rating: 2,
      categoryId: categoryIdBySlug.get('kitchen'),
      featured: 1,
    },
    {
      sku: 'GT-0087',
      name: 'Terra Planter, Small',
      description: 'A compact terracotta planter with a built-in drainage saucer, sized for windowsill herbs and small succulents.',
      price: 38,
      icon: 'plant',
      tint: 'accent',
      badge: null,
      rating: 3,
      categoryId: categoryIdBySlug.get('garden'),
      featured: 1,
    },
    {
      sku: 'GT-0203',
      name: 'Wick Table Lamp',
      description: 'A soft-glow table lamp with a fabric shade and a solid oak base — reading light that looks good switched off, too.',
      price: 96,
      icon: 'lamp',
      tint: 'sand',
      badge: 'Bestseller',
      rating: 3,
      categoryId: categoryIdBySlug.get('desk'),
      featured: 1,
    },
    {
      sku: 'GT-0056',
      name: 'Field Tote, Canvas',
      description: 'A heavyweight canvas tote with reinforced straps and an interior pocket — built to carry groceries or a laptop equally well.',
      price: 52,
      icon: 'bag',
      tint: 'teal',
      badge: null,
      rating: 1,
      categoryId: categoryIdBySlug.get('living'),
      featured: 1,
    },
    {
      sku: 'GT-0119',
      name: 'Ash Taper Candle Set',
      description: 'A set of six unscented taper candles in a soft ash hue, hand-dipped for a slow, even burn.',
      price: 19,
      icon: 'candle',
      tint: 'accent',
      badge: null,
      rating: 2,
      categoryId: categoryIdBySlug.get('bath'),
      featured: 1,
    },
    {
      sku: 'GT-0031',
      name: 'Hearth Serving Bowl',
      description: 'A wide stoneware serving bowl with a matte glaze, sized for salads, sides, or fruit on the counter.',
      price: 44,
      icon: 'bowl',
      tint: 'sand',
      badge: 'New',
      rating: 3,
      categoryId: categoryIdBySlug.get('kitchen'),
      featured: 1,
    },
  ];
  for (const product of products) insertProduct.run(product);
}
