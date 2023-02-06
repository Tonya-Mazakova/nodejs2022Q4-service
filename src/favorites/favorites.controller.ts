import {
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { DataSourceService } from '../dataSource/dataSource.service';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly dataStoreService: DataSourceService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Get()
  async findAll(): Promise<any> {
    return await this.favoritesService.findAll();
  }

  @Post('track/:uuid')
  @Header('Content-Type', 'application/json')
  async addTrack(@Param('uuid', new ParseUUIDPipe()) id: any) {
    return await this.favoritesService.add(id, 'tracks');
  }

  @Post('album/:uuid')
  @Header('Content-Type', 'application/json')
  async addAlbum(@Param('uuid', new ParseUUIDPipe()) id: any) {
    return await this.favoritesService.add(id, 'albums');
  }

  @Post('artist/:uuid')
  @Header('Content-Type', 'application/json')
  async addArtist(@Param('uuid', new ParseUUIDPipe()) id: any) {
    return await this.favoritesService.add(id, 'artists');
  }

  @Delete('track/:uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return await this.favoritesService.delete(id, 'tracks');
  }

  @Delete('album/:uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return await this.favoritesService.delete(id, 'albums');
  }

  @Delete('artist/:uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return await this.favoritesService.delete(id, 'artists');
  }
}
