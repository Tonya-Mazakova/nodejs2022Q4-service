import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../users/dto/users.dto';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import { TokensService } from './tokens/tokens.service';
import { ErrorMessages } from '../constants';
import { RefreshTokenDto } from './tokens/dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
    private tokensService: TokensService
  ) {}

  async signup(dto: CreateUserDto): Promise<any> {
    dto.password = await this.hashPassword(dto.password);
    return await this.userService.create(dto);
  }

  async login(dto: AuthDto) {
    const user = await this.userService.findByQuery('login', dto.login);

    const isPassEquals = await bcrypt.compare(dto.password, user.password);

    if (!isPassEquals) {
      throw new HttpException(
        ErrorMessages.FORBIDDEN,
        HttpStatus.FORBIDDEN
      )
    }

    const tokens = await this.tokensService.generateTokens(user.id, user.login);
    await this.tokensService.saveToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshTokens(dto: RefreshTokenDto): Promise<any> {
    let tokenData;

    try {
      tokenData = this.tokensService.validateRefreshToken(dto.refreshToken);

    } catch (e) {
      throw new HttpException(
        ErrorMessages.FORBIDDEN,
        HttpStatus.FORBIDDEN
      )
    }

    const user = await this.userService.findByID(tokenData?.userId);

    if (!user) {
      throw new HttpException(
        ErrorMessages.FORBIDDEN,
        HttpStatus.FORBIDDEN
      )
    }

    const tokens =
      await this.tokensService.generateTokens(tokenData.userId, tokenData.login);

    await this.tokensService.saveToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async hashPassword(data: string) {
    return bcrypt.hash(data, +(process.env.CRYPT_SALT));
  }
}
