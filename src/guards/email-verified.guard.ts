import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  // This method is called to determine if the route can be accessed by the user.
  // It checks whether the user's email is verified.
  async canActivate(context: ExecutionContext) {
    // Extract the 'user' object from the request in the execution context.
    const { user } = context.switchToHttp().getRequest();

    // Check if the user's email is verified.
    return user.isEmailVerified;
  }
}
