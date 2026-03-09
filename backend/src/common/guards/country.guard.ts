import { ForbiddenException } from '@nestjs/common';
import { User } from '../../data/seed';

// This is not a Guard class — it's a plain helper function
// We call it directly inside services where we need country validation
export function validateCountryAccess(
  resourceCountry: string,
  user: Partial<User>,
): void {
  // Admin has global access — null country means see everything
  if (user.role === 'admin') return;

  // Everyone else can only access their own country's data
  if (resourceCountry !== user.country) {
    throw new ForbiddenException(
      `Access denied: your account is scoped to ${user.country} only`,
    );
  }
}
