import { Router } from 'express';
import { db } from '../db';
import { ApiError } from '../lib/errors';
import { requireEmail, requireString } from '../lib/validate';
import { hashPassword, requireAuth, signToken, verifyPassword } from '../lib/auth';

export const authRouter = Router();

interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}

authRouter.post('/signup', (req, res) => {
  const name = requireString(req.body, 'name');
  const email = requireEmail(req.body);
  const password = requireString(req.body, 'password', 8);

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    throw new ApiError(409, 'An account with that email already exists.');
  }

  const { lastInsertRowid } = db
    .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .run(name, email, hashPassword(password));

  const user = { id: Number(lastInsertRowid), name, email };
  res.status(201).json({ token: signToken(user), user });
});

authRouter.post('/login', (req, res) => {
  const email = requireEmail(req.body);
  const password = requireString(req.body, 'password');

  const row = db.prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?').get(email) as
    | UserRow
    | undefined;

  if (!row || !verifyPassword(password, row.password_hash)) {
    throw new ApiError(401, 'Incorrect email or password.');
  }

  const user = { id: row.id, name: row.name, email: row.email };
  res.json({ token: signToken(user), user });
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});
