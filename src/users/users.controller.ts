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
  HttpStatus,
  ParseUUIDPipe,
  Header,
  ClassSerializerInterceptor,
  UseInterceptors
} from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from './users.dto';
import { DataSourceService } from '../dataSource/dataSource.service';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(
    private readonly dataStoreService: DataSourceService,
    private readonly usersService: UsersService
  ) {}

  @Get()
  async findAll(): Promise<any> {
    return await this.usersService.findAll();
  }

  @Get(':uuid')
  async findOne(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return await this.usersService.findByID(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @Header('Content-Type', 'application/json')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':uuid')
  @Header('Content-Type', 'application/json')
  async update(@Param('uuid', new ParseUUIDPipe()) id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    return await this.usersService.updateByID(id, updatePasswordDto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return await this.usersService.deleteByID(id);
  }
}
