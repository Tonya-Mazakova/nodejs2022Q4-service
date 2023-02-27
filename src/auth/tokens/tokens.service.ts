import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { TokenEntity } from './entities/token.entity';
import { ErrorMessages } from '../../constants';

@Injectable()
export class TokensService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(TokenEntity)
    private tokenRepo: Repository<TokenEntity>
  ) {}

  async generateTokens(userID: string, login: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userID,
          login,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userID,
          login,
        },
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken
    }
  }

  async validateAccessToken(accessToken) {
    try {
      return this.jwtService.verify(accessToken, { secret: process.env.JWT_SECRET_KEY });
    } catch (e) {
      throw new HttpException(
        ErrorMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      return this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET_REFRESH_KEY });
    } catch (e) {
      throw new HttpException(
        ErrorMessages.FORBIDDEN,
        HttpStatus.FORBIDDEN
      )
    }
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await this.tokenRepo.findOne({ where: { userId }})

    if (tokenData) {
      tokenData.refreshToken = refreshToken;

      await this.tokenRepo.update(
        { id: tokenData.id },
        tokenData
      );
    } else {
      await this.tokenRepo.create({ userId: userId, refreshToken });
    }

    return refreshToken
  }
}
