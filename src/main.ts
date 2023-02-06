import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const document = await readFile('./doc/api.yaml', 'utf-8');
  SwaggerModule.setup('doc', app, parse(document));

  await app.listen(PORT);
}
bootstrap();
