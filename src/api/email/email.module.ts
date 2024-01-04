import { Module } from '@nestjs/common';
import { Global } from '@nestjs/common/decorators';
import { EmailVerificationService } from './email-verification.service';

@Global()
@Module({
  exports: [EmailVerificationService], // Exports the EmailVerificationService for use in other modules.
  imports: [],
  providers: [EmailVerificationService] // Provides the EmailVerificationService within the module.
})
export class EmailModule {}
