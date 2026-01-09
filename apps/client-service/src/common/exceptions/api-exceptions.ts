import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiClientException extends HttpException {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: Error | unknown
  ) {
    super(
      {
        message,
        statusCode,
        timestamp: new Date().toISOString(),
        originalError: originalError instanceof Error ? originalError.message : originalError,
      },
      statusCode || HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

export class ApiRetryException extends ApiClientException {
  constructor(
    message: string,
    public readonly attempts: number,
    originalError?: Error | unknown
  ) {
    super(`${message} (after ${attempts} attempts)`, HttpStatus.SERVICE_UNAVAILABLE, originalError);
  }
}