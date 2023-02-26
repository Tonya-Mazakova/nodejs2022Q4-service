import {
  Body,
  Controller,
  Get,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/users.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/signup')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CreateUserDto): Promise<any> {
    return await this.authService.signup(dto);
  }
}
