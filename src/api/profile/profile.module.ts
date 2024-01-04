import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { OtpService } from '../otp/otp.service';
import { OtpModule } from '../otp/otp.module';
import { UtilitiesService } from 'src/helpers/utils';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [OtpModule], // Import the OtpModule to access its services.
  controllers: [ProfileController], // Controllers provided by this module.
  providers: [ProfileService, OtpService, UtilitiesService, JwtService] // Services provided by this module.
})
export class ProfileModule {}
