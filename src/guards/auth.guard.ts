import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorMessages } from '../constants';
import { TokensService } from '../auth/tokens/tokens.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private tokensService: TokensService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const arr = ['/auth/signup', '/auth/login', '/doc', '/'];
    const noAuth = arr.includes(request?.url);

    if (noAuth) {
      return true;
    }

    const authHeader =
      request.headers?.authorization?.split(' ');

    if (!authHeader?.[0].startsWith('Bearer')) {
      throw new HttpException(
        ErrorMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    try {
      await this.tokensService.validateAccessToken(authHeader?.[1]);
    } catch (e) {
      throw new HttpException(
        ErrorMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    return true;
  }
}
