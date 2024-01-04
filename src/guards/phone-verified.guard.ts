import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class PhoneVerifiedGuard implements CanActivate {
  // The `PhoneVerifiedGuard` is a Nest.js guard that checks whether the user's phone number is verified.
  // It's applied to routes that require phone verification for access.

  async canActivate(context: ExecutionContext) {
    // The `canActivate` method is called when this guard is invoked.
    // It receives the execution context as its parameter, which includes the request.

    // Extract the `user` object from the request context. This object typically holds user information.
    const { user } = context.switchToHttp().getRequest();

    // Check if the user's phone number is verified.
    // The guard allows access if the phone is verified.
    return user.isPhoneVerified;
  }
}
