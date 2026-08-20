import { Router } from 'express';
import { db } from '../db';
import { ApiError } from '../lib/errors';

export const productsRouter = Router();

const PRODUCT_COLUMNS = `
  p.sku, p.name, p.description, p.price, p.icon, p.tint, p.badge, p.rating,
  p.featured, c.slug AS category
`;

productsRouter.get('/', (req, res) => {
  const { category, q, badge, featured } = req.query;
  const clauses: string[] = [];
  const params: Record<string, unknown> = {};

  if (typeof category === 'string') {
    clauses.push('c.slug = @category');
    params.category = category;
  }
  if (typeof badge === 'string') {
    clauses.push('p.badge = @badge');
    params.badge = badge;
  }
  if (typeof featured === 'string') {
    clauses.push('p.featured = @featured');
    params.featured = featured === 'true' || featured === '1' ? 1 : 0;
  }
  if (typeof q === 'string' && q.trim()) {
    clauses.push('(p.name LIKE @q OR p.description LIKE @q)');
    params.q = `%${q.trim()}%`;
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const products = db
    .prepare(
      `SELECT ${PRODUCT_COLUMNS} FROM products p JOIN categories c ON c.id = p.category_id ${where} ORDER BY p.id`,
    )
    .all(params);
  res.json(products);
});

productsRouter.get('/:sku', (req, res) => {
  const product = db
    .prepare(`SELECT ${PRODUCT_COLUMNS} FROM products p JOIN categories c ON c.id = p.category_id WHERE p.sku = ?`)
    .get(req.params.sku);
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }
  res.json(product);
});
