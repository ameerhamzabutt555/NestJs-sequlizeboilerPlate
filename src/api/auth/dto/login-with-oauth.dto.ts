import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { EmailDto } from 'src/generic-dto/email.dto';

/**
 * Data transfer object (DTO) for login with OAuth.
 */
export class LoginWithOAuthDto extends EmailDto {
  @ApiProperty({
    description: 'accessToken',
    example: ''
  })
  @IsNotEmpty({ message: 'Access token can not be empty' })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'OAuth provider type'
  })
  @IsNotEmpty({ message: 'login type can not be empty' })
  @IsString()
  loginType: string;
}
