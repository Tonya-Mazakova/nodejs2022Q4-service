import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule,
    UsersModule,
    TokensModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService
  ],
})

export class AuthModule {}
