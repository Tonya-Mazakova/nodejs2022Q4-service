import { v4 as uuid } from 'uuid'
import {
  Controller,
  Get,
  Delete,
  Param,
  Post,
  Body,
  Put,
  HttpCode,
  HttpException,
  HttpStatus,
  ParseUUIDPipe
} from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from './users.dto';
import { User } from './users.interface';
import { DataSourceService } from '../dataSource/dataSource.service';
import { ErrorMessages } from '../constants';

@Controller('user')
export class UsersController {
  constructor(private readonly dataStoreService: DataSourceService) {}

  payload

  @Get()
  async findAll(): Promise<any> {
    return await this.dataStoreService.findAll();
  }

  @Get(':uuid')
  async findOne(@Param('uuid', new ParseUUIDPipe()) id: string) {
    const user = await this.dataStoreService.findByID(id);

    if (!user) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    } else {
      return this.payload = { status: HttpStatus.OK, data: user }
    }
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
   const user = {
     ...createUserDto,
     id: uuid(),
     version: 1,
     createdAt: Date.now(),
     updatedAt: Date.now()
   } as User;

    try {
      const data = await this.dataStoreService.createUser(user);
      this.payload = { status: HttpStatus.CREATED, data };
    } catch (e) {
      throw new HttpException(
        ErrorMessages.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return this.payload
  }

  @Put(':uuid')
  async updateUser(@Param('uuid', new ParseUUIDPipe()) id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    const user = await this.dataStoreService.findByID(id) as User;

    if (!user) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    if (updatePasswordDto.oldPassword !== user.password) {
      throw new HttpException(
        ErrorMessages.PASSWORD_ERROR,
        HttpStatus.FORBIDDEN
      );
    }

    try {
      this.payload =
        await this.dataStoreService.updateByID(id, {
          password: updatePasswordDto.newPassword
        });
    }catch (e) {
      throw new HttpException(
        ErrorMessages.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return this.payload;
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('uuid', new ParseUUIDPipe()) id: string) {
    const user = await this.dataStoreService.findByID(id);

    if (!user) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    } else {
      return await this.dataStoreService.deleteByID(id);
    }
  }
}
