import { v4 as uuid } from 'uuid';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Header
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto } from './dto/artists.dto';
import { DataSourceService } from '../dataSource/dataSource.service';

@Controller('artist')
export class ArtistsController {
  constructor(
    private readonly dataStoreService: DataSourceService,
    private readonly artistsService: ArtistsService
  ) {}

  @Get()
  async findAll(): Promise<any> {
    return await this.artistsService.findAll();
  }

  @Get(':uuid')
  async findOne(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return await this.artistsService.findByID(id);
  }

  @Post()
  @Header('Content-Type', 'application/json')
  async create(@Body() createArtistDto: CreateArtistDto) {
    return await this.artistsService.create(createArtistDto);
  }

  @Put(':uuid')
  @Header('Content-Type', 'application/json')
  async update(@Param('uuid', new ParseUUIDPipe()) id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return await this.artistsService.updateByID(id, updateArtistDto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByID(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return await this.artistsService.deleteByID(id);
  }
}
