import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { LoggerService } from './logger/Logger.service';
import { ErrorMessages } from './constants';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const loggerService = app.get(LoggerService);

  process.on('uncaughtException', async (err) => {
    await loggerService.error({
      message: `${ErrorMessages.UNCAUGHT_ERROR}, ${JSON.stringify(err)}`
    });
  });

  process.on('unhandledRejection', async (err) => {
    await loggerService.warn({
      message: `${ErrorMessages.UNHANDLED_REJECTION}, ${JSON.stringify(err)}`
    });
  });

  const document = await readFile('./doc/api.yaml', 'utf-8');
  SwaggerModule.setup('doc', app, parse(document));

  await app.listen(PORT);
}
bootstrap();
