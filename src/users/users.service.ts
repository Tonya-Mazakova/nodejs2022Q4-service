import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSourceService } from '../dataSource/dataSource.service';
import { User } from './users.interface';
import { v4 as uuid } from 'uuid';
import { ErrorMessages } from '../constants';
import { UserEntity } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly dataStoreService: DataSourceService) {}

  public async findAll(): Promise<any[]> {
    return Object.values(this.dataStoreService.users)
  }

  public async create(data): Promise<any> {
    const user = {
      ...data,
      id: uuid(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    } as User;

    this.dataStoreService.users[user.id] = user;

    return new UserEntity(user)
  }

  public async findByID(id: string): Promise<any> {
    const user = await this.dataStoreService.users[id];

    if (!user) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    } else {
      return user
    }
  }

  public async updateByID(id: string, { newPassword, oldPassword }: any): Promise<any> {
    const user = await this.findByID(id) as User;

    if (!user) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    if (oldPassword !== user.password) {
      throw new HttpException(
        ErrorMessages.PASSWORD_ERROR,
        HttpStatus.FORBIDDEN
      );
    }

    const data = this.dataStoreService.users[id] as User;

    this.dataStoreService.users[id] = {
      ...data,
      password: newPassword,
      version: ++data.version,
      updatedAt: Date.now()
    };

    return new UserEntity(this.dataStoreService.users[id])
  }

  public async deleteByID(id: string): Promise<boolean | HttpException> {
    const user = await this.findByID(id);

    if (!user) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return delete this.dataStoreService.users[id];
  }
}
