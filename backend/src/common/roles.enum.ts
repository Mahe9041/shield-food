// An enum is like `type` but for a set of named constants
// TypeScript enums are cleaner than plain strings in logic
export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
}

// This is the SINGLE SOURCE OF TRUTH for all access control
// Every permission decision in the entire app comes from this one object
export const PERMISSION_MAP: Record<string, Role[]> = {
  view_restaurants: [Role.ADMIN, Role.MANAGER, Role.MEMBER],
  create_order: [Role.ADMIN, Role.MANAGER, Role.MEMBER],
  place_order: [Role.ADMIN, Role.MANAGER],
  cancel_order: [Role.ADMIN, Role.MANAGER],
  update_payment: [Role.ADMIN],
};
