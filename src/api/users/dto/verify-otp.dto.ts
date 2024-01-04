import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

/**
 * Data transfer object (DTO) for verify otp.
 */
export class VerifyOtpDto {
  @ApiProperty()
  @IsNumber()
  otp: number;
}
