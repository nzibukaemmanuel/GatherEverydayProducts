import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import './db';
import { authRouter } from './routes/auth.routes';
import { categoriesRouter } from './routes/categories.routes';
import { ordersRouter } from './routes/orders.routes';
import { productsRouter } from './routes/products.routes';
import { errorHandler } from './lib/errors';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);

const browserDist = path.join(__dirname, '..', '..', 'dist', 'gather-ecommerce', 'browser');
if (fs.existsSync(browserDist)) {
  app.use(express.static(browserDist));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) {
      next();
      return;
    }
    res.sendFile(path.join(browserDist, 'index.html'));
  });
}

app.use(errorHandler);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
