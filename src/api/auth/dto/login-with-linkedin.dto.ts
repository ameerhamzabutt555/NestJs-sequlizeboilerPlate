import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Data transfer object (DTO) for login with LinkedIn.
 */
export class LoginWithLinkedInDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  grantType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  redirectURI: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  clientSecret: string;
}
