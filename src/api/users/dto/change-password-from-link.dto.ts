import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Data transfer object (DTO) for chnage password.
 */
export class ChangePasswordFromLinkDto {
  @ApiProperty({
    description: 'email',
    example: '*****'
  })
  @IsNotEmpty({ message: 'email can not be empty' })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'accessToken',
    example: '*****'
  })
  @IsNotEmpty({ message: 'access token cannot be empty' })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'password',
    example: '*****'
  })
  @IsNotEmpty({ message: 'password can not be empty' })
  @IsString()
  password: string;
}
