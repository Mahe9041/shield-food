import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

// This is the "key" we use to store and retrieve permission metadata
// Like a label on a box
export const PERMISSION_KEY = 'permission';

// @RequirePermission('place_order')
// → stores the string 'place_order' as metadata on the route handler
export const RequirePermission = (permission: string) =>
  SetMetadata(PERMISSION_KEY, permission);

// @CurrentUser()
// → extracts the user object that JwtAuthGuard attached to the request
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request: { user: string } = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
