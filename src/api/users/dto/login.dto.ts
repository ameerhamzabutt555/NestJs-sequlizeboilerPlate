import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Data transfer object (DTO) for login.
 */
export class LoginDto {
  @ApiProperty({
    description: 'user email',
    example: 'abc@user.com'
  })
  @IsNotEmpty({ message: 'email/username cannot be empty' })
  email: string;

  @ApiProperty({
    description: 'password',
    example: '*****'
  })
  @IsNotEmpty({ message: 'password can not be empty' })
  @IsString()
  password: string;
}
