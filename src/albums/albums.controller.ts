import { v4 as uuid } from 'uuid';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Header
} from '@nestjs/common';
import { DataSourceService } from '../dataSource/dataSource.service';
import { AlbumsService } from './albums.service';
import { Artist } from '../artists/artists.interface';
import { CreateArtistDto } from '../artists/dto/artists.dto';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/albums.dto';
import { ErrorMessages } from '../constants';
import { Album } from './albums.interface';

@Controller('album')
export class AlbumsController {
  constructor(
    private readonly dataStoreService: DataSourceService,
    private readonly albumsService: AlbumsService
  ) {}

  @Get()
  async findAll(): Promise<any> {
    return await this.albumsService.findAll();
  }

  @Post()
  @Header('Content-Type', 'application/json')
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    return await this.albumsService.create(createAlbumDto);
  }

  @Get(':uuid')
  async findOne(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return await this.albumsService.findByID(id);
  }

  @Put(':uuid')
  @Header('Content-Type', 'application/json')
  async update(@Param('uuid', new ParseUUIDPipe()) id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return await this.albumsService.updateByID(id, updateAlbumDto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByID(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return await this.albumsService.deleteByID(id);
  }
}
