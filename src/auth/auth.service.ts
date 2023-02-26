import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/users.dto';
import { UsersService } from '../users/users.service';

export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService
  ) {}

  async signup(dto: CreateUserDto): Promise<any> {

  }
}
