import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  Inject
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

import { ErrorMessages } from '../constants';
import { LoggerService } from '../logger/Logger.service';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  @Inject()
  private readonly loggerService: LoggerService;

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const timestamp = new Date().valueOf();
    const status =
      exception.status ? exception.status : HttpStatus.INTERNAL_SERVER_ERROR;

    await this.loggerService.error({
      statusCode: status,
      url: request?.url,
      query_params: JSON.stringify(request?.query),
      body: request?.body,
      timestamp
    });

    response
      .status(status)
      .json({
        statusCode: status,
        message: this.getClientRespMessage(status, exception),
        timestamp,
        path: request?.url,
      });
  }

  private getClientRespMessage(status: number, exception: any): any {
    if (status !== HttpStatus.INTERNAL_SERVER_ERROR) {
      return this.getBackwardsCompatibleMessageObject(exception, status);
    }

    return ErrorMessages.SERVER_ERROR;
  }

  private getBackwardsCompatibleMessageObject(exception: any, status: number): any {
    const errorResponse = exception?.response;

    if (errorResponse && errorResponse?.error) {
      return {
        error: errorResponse?.error,
        message: errorResponse?.message,
        status
      };
    }

    return { error: exception?.message, status };
  }
}
