import { LoggerService as LoggerServiceCommon } from '@nestjs/common';
import { appendFile, access } from 'node:fs';
import { stat } from 'fs/promises'

enum LogLevel {
  Error = 0,
  Warn = 1,
  Log = 3,
  Verbose = 4,
  Debug = 5
}

enum LogSeverity {
  Debug = 'debug',
  Verbose = 'verbose',
  Log = 'log',
  Warn = 'warn',
  Error = 'error',
}

interface LogPayload {
  statusCode?: number,
  url?: string;
  query_params?: string;
  body?: string;
  timestamp?: number;
  severity?: LogSeverity;
  [key: string]: string | number | {
    param1: number[];
    param2: string;
    param3: string;
  }
}

export class LoggerService implements LoggerServiceCommon {
  level: LogLevel = LogLevel[process.env.LOG_LEVEL] || LogLevel.Debug;
  logFileName = `log_${new Date().valueOf()}.txt`;
  logFileMaxSizeInBytes = (+process.env.LOG_FILE_MAX_SIZE * 1024) || 10 * 1024;

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  private async writeToLog(level: LogLevel, payload: LogPayload): Promise<any> {
    if (!this.shouldLog(level)) {
      return;
    }

    process.stdout.write(`LOGGER_SERVICE ${payload.severity}:\n`);
    process.stdout.write(JSON.stringify(payload));
    process.stdout.write(`\n`);

    await access(this.logFileName, async (err) => {
      let isFileExist = true;

      if (err) isFileExist = false;

      if (isFileExist && (await this.fileSize(this.logFileName) > this.logFileMaxSizeInBytes)) {
        this.logFileName = `log_${new Date().valueOf()}.txt`;
      }

      await appendFile(this.logFileName,
        JSON.stringify(payload),
        {flag: 'a'},
        err => { if(err) console.log(err) })

    });
  }

  private async fileSize(path) {
    const stats = await stat(path);

    return stats.size // in bytes
  }

  /**
   * Write a 'log' level log.
   */
  async log(payload: LogPayload) {
    await this.writeToLog(LogLevel.Log, {...payload, severity: LogSeverity.Log });
  }

  /**
   * Write an 'error' level log.
   */
  async error(payload: LogPayload) {
    await this.writeToLog(LogLevel.Error, {...payload, severity: LogSeverity.Error });
  }

  /**
   * Write a 'warn' level log.
   */
  async warn(payload: LogPayload) {
    await this.writeToLog(LogLevel.Warn, {...payload, severity: LogSeverity.Warn });
  }

  /**
   * Write a 'debug' level log.
   */
  async debug?(payload: LogPayload) {
    await this.writeToLog(LogLevel.Debug, {...payload, severity: LogSeverity.Debug });
  }

  /**
   * Write a 'verbose' level log.
   */
  async verbose?(payload: LogPayload) {
    await this.writeToLog(LogLevel.Verbose, {...payload, severity: LogSeverity.Verbose });
  }
}



