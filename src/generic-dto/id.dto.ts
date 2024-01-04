import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// The `IdDto` class is a Data Transfer Object (DTO) used for handling ID-related data in your application.
export class IdDto {
  @ApiProperty()
  // The `@ApiProperty` decorator is used to specify metadata for the `id` property.
  // This metadata is used by Swagger to generate API documentation.
  @IsString()
  // The `@IsString` decorator is a validation rule to ensure that the `id` property is a valid string.
  readonly id: string; // The `id` property holds the ID as a string.
}
