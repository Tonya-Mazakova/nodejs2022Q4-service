import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TokensService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './entities/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenEntity]),
    JwtModule.register({})
  ],
  providers: [TokensService],
  exports: [TokensService, TypeOrmModule],
})
export class TokensModule {}
