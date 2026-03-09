import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/decorators';
import { PERMISSION_MAP } from '../roles.enum';
import { User } from 'src/data/seed';

@Injectable()
export class PermissionGuard implements CanActivate {
  // Reflector is a NestJS utility that reads decorator metadata
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Step 1: Read what permission this route requires
    // getAllAndOverride checks both the method and the class decorator
    const permission = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no @RequirePermission decorator, allow the request through
    if (!permission) return true;

    // Step 2: Get the user (JwtAuthGuard already put them here)
    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('Not authenticated');

    // Step 3: Look up who can do this action
    const allowedRoles = PERMISSION_MAP[permission];
    if (!allowedRoles) {
      throw new ForbiddenException(`Unknown permission: ${permission}`);
    }

    // Step 4: Is user's role in the allowed list?
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Your role "${user.role}" cannot perform: ${permission}`,
      );
    }

    return true;
  }
}
