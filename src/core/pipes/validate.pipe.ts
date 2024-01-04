import {
  ArgumentMetadata,
  BadRequestException,
  UnprocessableEntityException,
  ValidationPipe
} from '@nestjs/common';

// Create a custom validation pipe that extends the ValidationPipe
export class ValidateInputPipe extends ValidationPipe {
  public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    try {
      // Try to validate the incoming value using the standard ValidationPipe
      return await super.transform(value, metadata);
    } catch (error) {
      if (error instanceof BadRequestException) {
        // If a BadRequestException is thrown during validation, convert it to an UnprocessableEntityException
        throw new UnprocessableEntityException(this.handleError(error['response'].message));
      }
    }
  }

  // Private method to format and handle validation errors
  private handleError(errors) {
    return errors.map((error) => error);
  }
}
