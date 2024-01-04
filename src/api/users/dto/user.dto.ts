import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ROLE_TYPE } from 'src/constants';

/**
 * Data transfer object (DTO) for user creating.
 */
export class UserDto {
  @ApiProperty({
    description: 'name',
    example: 'john sam'
  })
  @IsNotEmpty({ message: 'name can not be empty' })
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'user email',
    example: 'abc@user.com'
  })
  @IsNotEmpty({ message: 'email can not be empty' })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    enum: ROLE_TYPE,
    enumName: 'ROLE_TYPE'
  })
  @IsString()
  role: ROLE_TYPE;

  @ApiProperty({
    description: 'password',
    example: '*****'
  })
  @IsNotEmpty({ message: 'password can not be empty' })
  @IsString()
  password: string;
}
