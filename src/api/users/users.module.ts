import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './users.service';
import { UtilitiesService } from 'src/helpers/utils';
import { EmailVerificationService } from '../email/email-verification.service';
import { OtpService } from '../otp/otp.service';

@Module({
  exports: [UsersService], // Export the UsersService for other modules.
  imports: [], // List of imported modules (none in this case).
  controllers: [UsersController], // Controllers provided by this module.
  providers: [
    // Services and utilities provided by this module.
    UsersService,
    JwtService, // JSON Web Token service for authentication.
    OtpService, // Service for handling OTP (One-Time Password).
    UtilitiesService, // Utility service for common functions.
    EmailVerificationService // Service for email verification.
  ]
})
export class UsersModule {}
