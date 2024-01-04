import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class LoginVerifiedGuard implements CanActivate {
  // This guard, when applied to a route, allows access regardless of the user's login verification status.
  // For documentation purposes, it's currently configured to return `true` unconditionally.

  async canActivate(context: ExecutionContext) {
    // The `canActivate` method is called when this guard is invoked.
    // It receives the execution context as its parameter, which includes the request.

    const { user } = context.switchToHttp().getRequest();
    // Extract the `user` object from the request context. This object typically holds user information.

    // You can implement your custom logic to determine whether access should be granted based on the user's login verification status.
    // For now, it returns `true` unconditionally, meaning access is allowed.

    // Replace the following line with your logic to check `user.isLoginVerified` and return the appropriate value.
    // return user.isLoginVerified;
    return true; // Unconditionally allowing access for documentation purposes.
  }
}
