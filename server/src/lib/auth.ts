import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from './errors';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-do-not-use-in-production';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

function readUser(req: Request): AuthUser | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(header.slice(7), JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  req.user = readUser(req) ?? undefined;
  next();
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const user = readUser(req);
  if (!user) {
    next(new ApiError(401, 'Sign in to continue.'));
    return;
  }
  req.user = user;
  next();
}
