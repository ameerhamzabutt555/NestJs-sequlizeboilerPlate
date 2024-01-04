import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_TYPE } from 'src/constants';

@Injectable()
export class PermissionAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    // The `PermissionAccessGuard` is a Nest.js guard that checks whether the user has the required roles.
    // It's applied to routes that need role-based access control.
    // The `Reflector` is used to retrieve and set metadata.
  }

  async canActivate(context: ExecutionContext) {
    // The `canActivate` method is called when this guard is invoked.
    // It receives the execution context as its parameter, which includes the request.

    // Retrieve the required roles from route metadata.
    const requireRoles = this.reflector.getAllAndOverride<ROLE_TYPE[]>('roles', [
      context.getHandler(),
      context.getClass()
    ]);

    // Extract the `user` object from the request context. This object typically holds user information.
    const { user } = context.switchToHttp().getRequest();

    // Check if the user's role matches any of the required roles.
    // The guard allows access if there's a match.
    return requireRoles.some((role) => [user.role].includes(role));
  }
}
