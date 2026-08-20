import { Router } from 'express';
import { db } from '../db';

export const categoriesRouter = Router();

categoriesRouter.get('/', (_req, res) => {
  const categories = db.prepare('SELECT slug, name, icon, tint FROM categories ORDER BY name').all();
  res.json(categories);
});
