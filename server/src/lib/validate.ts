import { ApiError } from './errors';

export function requireString(body: Record<string, unknown>, field: string, minLength = 1): string {
  const value = body[field];
  if (typeof value !== 'string' || value.trim().length < minLength) {
    throw new ApiError(400, `${field} is required.`);
  }
  return value.trim();
}

export function requireEmail(body: Record<string, unknown>, field = 'email'): string {
  const value = requireString(body, field);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new ApiError(400, 'Enter a valid email address.');
  }
  return value.toLowerCase();
}

export function requirePositiveNumber(body: Record<string, unknown>, field: string): number {
  const value = body[field];
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new ApiError(400, `${field} must be a positive number.`);
  }
  return value;
}
