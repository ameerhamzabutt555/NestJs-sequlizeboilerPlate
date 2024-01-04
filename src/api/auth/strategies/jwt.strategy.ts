import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JwtStrategy.
   * @param {UsersService} _userService - The UsersService for user validation.
   */
  constructor(private readonly _userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY
    });
  }

  /**
   * Validates the user by checking the payload from the JWT token.
   * @param {any} payload - The payload of the JWT token.
   * @returns {Promise<any>} - Resolves to the user if valid; otherwise, throws UnauthorizedException.
   */
  async validate(payload: any): Promise<any> {
    const user = await this._userService.findOneById(payload.id);

    if (!user) {
      throw new UnauthorizedException('You are not authorized to perform the operation');
    }
    return user;
  }
}
