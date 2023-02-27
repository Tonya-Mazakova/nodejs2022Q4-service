import { Module } from '@nestjs/common';
import { LoggerService } from './Logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
