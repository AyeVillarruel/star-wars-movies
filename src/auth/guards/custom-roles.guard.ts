import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../../shared/decorators/roles.decorator';

@Injectable()
export class CustomRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('🔹 User from JWT:', user); 
    console.log('🔹 Required Roles:', requiredRoles); 

    if (!user) {
      throw new ForbiddenException('Access denied. You must be logged in.');
    }

    if (!user.role) {
      throw new ForbiddenException(' Access denied. No role found in your account.');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        ` Access denied. Your role (${user.role}) does not have permission to perform this action.`
      );
    }

    console.log('Access Granted');
    return true;
  }
}
