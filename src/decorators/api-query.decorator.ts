import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

// The `ApiQueryArray` function is a custom decorator for generating multiple ApiQuery decorators.

export function ApiQueryArray(roles) {
  // The `roles` parameter is an array of roles or items to be used in ApiQuery decorators.

  // Map the roles to individual ApiQuery decorators and store them in the `final` array.
  const final = roles.map((item) => ApiQuery(item));

  // Apply all ApiQuery decorators in the `final` array to the target endpoint or class.
  return applyDecorators(...final);
}
