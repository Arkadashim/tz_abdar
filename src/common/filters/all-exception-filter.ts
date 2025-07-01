import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  logger = new Logger('Exception filter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    const message = exception?.['message'] || 'Internal error';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

    const error: object = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      request: {
        method: request.method,
        path: request.path,
        params: request.params,
        query: request.query,
        body: request.body,
      },
    };

    if (process.env.NODE_ENV !== 'production') {
      error['stack'] = exception?.['stack'];
    }

    if (process.env.LOG_LEVEL !== 'off') {
      this.logger.error(exception);
    }

    response.status(status).json(error);
  }
}
