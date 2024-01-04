import { ApiProperty } from '@nestjs/swagger';

// The `ConditionDto` class is a Data Transfer Object (DTO) used for handling conditions in your application.
// It contains a single property `condition` to represent the condition data.

export class ConditionDto {
  @ApiProperty()
  // The `@ApiProperty` decorator is used to specify metadata for the `condition` property.
  // This metadata is used by Swagger to generate API documentation.
  condition: any; // The `condition` property holds the condition data.
}
