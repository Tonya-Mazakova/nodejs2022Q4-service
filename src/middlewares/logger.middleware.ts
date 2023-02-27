import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../logger/Logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  @Inject()
  private readonly loggerService: LoggerService;

  use(request: Request, response: Response, next: NextFunction) {
    const userAgent = request?.get('user-agent') || '';

    response.on('close', async () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const payload = {
        statusCode,
        url: request?.url,
        query_params: JSON.stringify(request?.query),
        body: JSON.stringify(request?.body),
        timestamp: new Date().valueOf()
      };

      if ([110, 111, 112, 113, 199, 214, 299].includes(statusCode)) {
        await this.loggerService.warn({
          ...payload,
          method: request?.method,
          userAgent: JSON.stringify(userAgent),
          contentLength: JSON.stringify(contentLength),
        });
      }

      await this.loggerService.log(payload);

      await this.loggerService.verbose({
        ...payload,
        ip: request?.ip,
        method: request?.method,
        userAgent: JSON.stringify(userAgent),
        contentLength: JSON.stringify(contentLength),
      });

      await this.loggerService.debug({
        ...payload,
        ip: request?.ip,
        method: request?.method,
        userAgent: JSON.stringify(userAgent),
        contentLength: JSON.stringify(contentLength),
      });
    });

    if (next) {
      next();
    }
  }
}
