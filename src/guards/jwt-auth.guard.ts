import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // This guard extends the AuthGuard from @nestjs/passport to protect routes using JWT authentication.
  // It is used to ensure that incoming requests have a valid JWT token.
  // The "jwt" strategy is specified, which means this guard will use the Passport JWT strategy.
  // The guard doesn't require additional code as it inherits the behavior from the AuthGuard class.
  // When applied to a route, it checks for a valid JWT token in the request and handles authentication automatically.
  // If a valid token is not present, it throws an UnauthorizedException, preventing access to the route.
}
