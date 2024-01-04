import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// The `EmailDto` class is a Data Transfer Object (DTO) used for handling email-related data in your application.
export class EmailDto {
  @ApiProperty()
  // The `@ApiProperty` decorator is used to specify metadata for the `email` property.
  // This metadata is used by Swagger to generate API documentation.
  @IsEmail() // The `@IsEmail` decorator is a validation rule to ensure that the `email` property is a valid email address.
  readonly email: string; // The `email` property holds the email address as a string.
}
