import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Data transfer object (DTO) for change password.
 */
export class ChangePasswordDto {
  @ApiProperty({
    description: 'oldPassword',
    example: '*****'
  })
  @IsNotEmpty({ message: 'old password can not be empty' })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'password',
    example: '*****'
  })
  @IsNotEmpty({ message: 'password can not be empty' })
  @IsString()
  newPassword: string;

  @ApiProperty({
    description: 'confirmPassword',
    example: '*****'
  })
  @IsNotEmpty({ message: 'Confirm password can not be empty' })
  @IsString()
  confirmPassword: string;
}
