import crypto from 'crypto';
import { Router } from 'express';
import { db } from '../db';
import { ApiError } from '../lib/errors';
import { requireEmail, requireString } from '../lib/validate';
import { hashPassword, requireAuth, signToken, verifyPassword } from '../lib/auth';
import { sendPasswordResetEmail } from '../lib/mailer';

export const authRouter = Router();

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}

interface PasswordResetRow {
  id: number;
  user_id: number;
  expires_at: string;
}

function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
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

authRouter.post('/forgot-password', async (req, res, next) => {
  try {
    const email = requireEmail(req.body);

    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as
      | { id: number }
      | undefined;

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString();

      db.prepare('DELETE FROM password_resets WHERE user_id = ?').run(user.id);
      db.prepare(
        'INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      ).run(user.id, hashResetToken(token), expiresAt);

      const origin = process.env.APP_URL || req.headers.origin || `http://localhost:${process.env.PORT || 3000}`;
      await sendPasswordResetEmail(email, `${origin}/reset-password?token=${token}`);
    }

    res.json({ message: "If an account exists for that email, we've sent a reset link." });
  } catch (err) {
    next(err);
  }
});

authRouter.get('/reset-password/validate', (req, res) => {
  const token = typeof req.query.token === 'string' ? req.query.token : '';
  const row = token
    ? (db
        .prepare('SELECT id, user_id, expires_at FROM password_resets WHERE token_hash = ?')
        .get(hashResetToken(token)) as PasswordResetRow | undefined)
    : undefined;

  res.json({ valid: !!row && new Date(row.expires_at).getTime() > Date.now() });
});

authRouter.post('/reset-password', (req, res) => {
  const token = requireString(req.body, 'token');
  const password = requireString(req.body, 'password', 8);

  const row = db
    .prepare('SELECT id, user_id, expires_at FROM password_resets WHERE token_hash = ?')
    .get(hashResetToken(token)) as PasswordResetRow | undefined;

  if (!row || new Date(row.expires_at).getTime() < Date.now()) {
    throw new ApiError(400, 'This reset link is invalid or has expired.');
  }

  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(password), row.user_id);
  db.prepare('DELETE FROM password_resets WHERE id = ?').run(row.id);

  res.json({ message: 'Password updated.' });
});
