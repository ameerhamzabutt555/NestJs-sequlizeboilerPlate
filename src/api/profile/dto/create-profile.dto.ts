import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * Data transfer object (DTO) for profile creating.
 */
export class CreateProfileDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  city: string;
}
