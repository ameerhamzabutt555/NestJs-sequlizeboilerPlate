import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * Data transfer object (DTO) for generate otp.
 */
export class GenerateOtpDto {
  @ApiProperty()
  @IsString()
  phone: string;
}
