import { Router } from 'express';
import { db } from '../db';
import { ApiError } from '../lib/errors';
import { requireEmail, requireString } from '../lib/validate';
import { optionalAuth } from '../lib/auth';

export const ordersRouter = Router();

const SHIPPING_FEE = 6;
const FREE_SHIPPING_THRESHOLD = 75;

interface OrderItemInput {
  sku: string;
  qty: number;
}

interface ProductRow {
  sku: string;
  name: string;
  price: number;
}

ordersRouter.post('/', optionalAuth, (req, res) => {
  const { items, shipping, guestEmail } = req.body as {
    items?: OrderItemInput[];
    shipping?: Record<string, unknown>;
    guestEmail?: string;
  };

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Your cart is empty.');
  }
  if (!shipping) {
    throw new ApiError(400, 'Shipping details are required.');
  }
  if (!req.user && !guestEmail) {
    throw new ApiError(400, 'An email is required for guest checkout.');
  }

  const shippingName = requireString(shipping, 'name');
  const shippingAddress = requireString(shipping, 'address');
  const shippingCity = requireString(shipping, 'city');
  const shippingPostal = requireString(shipping, 'postal');
  const shippingCountry = requireString(shipping, 'country');

  const resolvedItems = items.map((item) => {
    if (!item.sku || !Number.isInteger(item.qty) || item.qty <= 0) {
      throw new ApiError(400, 'Invalid cart item.');
    }
    const product = db.prepare('SELECT sku, name, price FROM products WHERE sku = ?').get(item.sku) as
      | ProductRow
      | undefined;
    if (!product) {
      throw new ApiError(400, `Unknown product: ${item.sku}`);
    }
    return { ...product, qty: item.qty };
  });

  const subtotal = resolvedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const insertOrder = db.prepare(`
    INSERT INTO orders (
      user_id, guest_email, subtotal, shipping_fee, total,
      shipping_name, shipping_address, shipping_city, shipping_postal, shipping_country
    ) VALUES (@userId, @guestEmail, @subtotal, @shippingFee, @total, @shippingName, @shippingAddress, @shippingCity, @shippingPostal, @shippingCountry)
  `);
  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, sku, name, price, qty) VALUES (@orderId, @sku, @name, @price, @qty)
  `);

  const orderId = db.transaction(() => {
    const { lastInsertRowid } = insertOrder.run({
      userId: req.user?.id ?? null,
      guestEmail: req.user ? null : requireEmail({ email: guestEmail }),
      subtotal,
      shippingFee,
      total,
      shippingName,
      shippingAddress,
      shippingCity,
      shippingPostal,
      shippingCountry,
    });
    for (const item of resolvedItems) {
      insertItem.run({ orderId: Number(lastInsertRowid), ...item });
    }
    return Number(lastInsertRowid);
  })();

  res.status(201).json(loadOrder(orderId));
});

ordersRouter.get('/:id', (req, res) => {
  const orderId = Number(req.params.id);
  if (!Number.isInteger(orderId)) {
    throw new ApiError(400, 'Invalid order id.');
  }
  const order = loadOrder(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }
  res.json(order);
});

function loadOrder(orderId: number) {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  if (!order) return null;
  const items = db.prepare('SELECT sku, name, price, qty FROM order_items WHERE order_id = ?').all(orderId);
  return { ...order, items };
}
