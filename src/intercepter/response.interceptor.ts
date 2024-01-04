import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Interface representing the response structure that the interceptor transforms to
export interface Response<T> {
  data: T;
}

/**
 * Injectable NestJS interceptor that transforms the response format.
 * It handles successful responses and errors, providing a standardized structure.
 * @typeparam T - The type of data in the response.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  /**
   * Intercept method to transform the response format.
   * @param context - The execution context.
   * @param next - The call handler.
   * @returns An observable with a transformed response structure.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((value: any) => {
        return {
          Succeeded: true,
          TotalRecords: value?.totalRecords ? value.totalRecords : 0,
          HttpResponseCode: value?.status && typeof value.status === 'number' ? value.status : 201,
          message: value?.message ? value.message : 'Successful',
          data:
            (value?.totalRecords !== null &&
              value?.totalRecords !== undefined &&
              typeof value?.totalRecords === 'number') ||
            value?.data
              ? value.data
              : value?.message
              ? []
              : value
        };
      }),
      catchError((err) => {
        const errorMessage = {
          Succeeded: false,
          TotalRecords: 0,
          HttpResponseCode: err?.status
            ? err.status
            : err?.response?.statusCode
            ? err?.response?.statusCode
            : 500,
          message:
            typeof err?.response === 'string'
              ? err?.response
              : err?.response?.message || err?.message,
          data: null
        };
        return throwError(
          () =>
            new HttpException(
              errorMessage,
              err?.statusCode
                ? err.statusCode
                : err?.response?.statusCode
                ? err?.response?.statusCode
                : 500
            )
        );
      })
    );
  }
}
