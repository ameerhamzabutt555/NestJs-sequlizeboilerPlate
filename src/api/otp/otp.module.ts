import { Module } from '@nestjs/common';
import { Global } from '@nestjs/common/decorators';
import { JwtService } from '@nestjs/jwt';
import { UtilitiesService } from 'src/helpers/utils';
import { OtpService } from './otp.service';

@Global()
@Module({
  exports: [OtpService], // Exports the OtpService for use in other modules.
  providers: [OtpService, UtilitiesService, JwtService] // Provides the OtpService and its dependencies within the module.
})
export class OtpModule {}
