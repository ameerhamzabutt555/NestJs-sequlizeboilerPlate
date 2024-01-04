import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { UtilitiesService } from 'src/helpers/utils';
import { HttpModule } from '@nestjs/axios/dist';

@Module({
  imports: [
    // UsersModule provides user-related functionality.
    UsersModule,

    // PassportModule for authentication and authorization.
    PassportModule,

    // HttpModule for making HTTP requests.
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),

    // JwtModule for handling JSON Web Tokens (JWT).
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // Enter the secret key from the configuration file.
      signOptions: { expiresIn: '8h' } // JWT token expiration time.
    })
  ],
  exports: [AuthService], // Exports the AuthService for use in other modules.

  providers: [
    AuthService, // The core authentication service.
    JwtService, // JwtService for token management.
    JwtStrategy, // JwtStrategy for JWT-based authentication.
    // RefreshTokenStrategy, // Optional strategy for refresh tokens.
    UtilitiesService // UtilitiesService for general utility functions.
  ],

  controllers: [AuthController] // Controllers for handling authentication-related routes.
})
export class AuthModule {}
