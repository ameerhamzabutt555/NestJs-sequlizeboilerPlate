import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

// The `PaginationDto` class is a Data Transfer Object (DTO) used for handling pagination and filtering options in your application.

export class PaginationDto {
  @ApiProperty({
    minimum: 1,
    maximum: 10000,
    title: 'Page',
    exclusiveMaximum: true,
    exclusiveMinimum: true,
    format: 'int32',
    default: 1
  })
  // The `page` property represents the page number for pagination.
  page?: number | undefined;

  @ApiProperty({
    minimum: 0,
    maximum: 50,
    default: 10
  })
  // The `pageSize` property represents the number of items per page.
  pageSize?: number | undefined;

  @ApiProperty({ default: 'id' })
  @IsNotEmpty()
  // The `sortColumn` property specifies the column by which to sort the results.
  sortColumn: string;

  @ApiProperty({ default: 'DESC' })
  @IsNotEmpty()
  // The `sortOrder` property specifies the sorting order (e.g., 'ASC' or 'DESC').
  sortOrder: string;

  @ApiProperty()
  // The `condition` property is used for applying filters or conditions to the query.
  condition: any;

  @ApiProperty()
  // The `attributes` property represents a list of specific attributes to retrieve.
  attributes?: string[] | undefined;
}
