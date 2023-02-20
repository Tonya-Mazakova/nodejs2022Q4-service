import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSourceService } from '../dataSource/dataSource.service';
import { User } from './users.interface';
import { ErrorMessages } from '../constants';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto, UpdatePasswordDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly dataStoreService: DataSourceService,
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>
  ) {}

  public async findAll(): Promise<any[]> {
    return this.userRepo.find();
  }

  public async create(data: CreateUserDto): Promise<any> {
    const user = new UserEntity(data);

    return this.userRepo.save(user);
  }

  public async findByID(id: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { id }});

    if (!user) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    } else {
      return user
    }
  }

  public async updateByID(id: string, { newPassword, oldPassword }: UpdatePasswordDto): Promise<any> {
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

    const result = {
      ...user,
      password: newPassword,
      version: ++user.version,
      updatedAt: +(Date.now().valueOf())
    };

    await this.userRepo.update(
      { id },
      result
    );

    return new UserEntity(result);
  }


  public async deleteByID(id: string): Promise<any | HttpException> {
    const user = await this.findByID(id);

    if (!user) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return !!(await this.userRepo.remove(user));
  }
}
