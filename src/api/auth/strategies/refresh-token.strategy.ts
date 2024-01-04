import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  /**
   * Creates an instance of RefreshTokenStrategy.
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true
    });
  }

  /**
   * Validates the refresh token by extracting it from the request headers.
   * @param {Request} req - The HTTP request.
   * @param {any} payload - The payload of the JWT token.
   * @returns {Object} - Resolves to an object containing payload and refreshToken.
   */
  validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
