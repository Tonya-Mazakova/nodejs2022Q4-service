import { IsString, IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';

class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

class UserEntity {
  id: string;
  version: number;
  createdAt: number;
  updatedAt: number;
  login: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string; // previous password

  @IsNotEmpty()
  @IsString()
  newPassword: string; // new password
}

export { CreateUserDto, UpdatePasswordDto, UserEntity }
