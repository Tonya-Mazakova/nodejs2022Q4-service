import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { DataSourceService } from '../dataSource/dataSource.service';
import { Album } from './albums.interface';
import { v4 as uuid } from 'uuid';
import { ErrorMessages, DataSourceTypes } from '../constants';
import { TracksService } from '../tracks/tracks.service';
import { Track } from '../tracks/tracks.interface';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumsService {
  constructor(
    private readonly dataStoreService: DataSourceService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  public async findAll(): Promise<Album[]> {
    return Object.values(this.dataStoreService.albums)
  }

  public async create(data): Promise<any> {
    const album = {
      ...data,
      id: uuid(),
    } as Album;

    this.dataStoreService.albums[album.id] = album;

    return album
  }

  public async findByID(id: string): Promise<any> {
    const album = await this.dataStoreService.albums[id];

    if (!album) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return album
  }

  public async updateByID(id: string, data: any): Promise<any> {
    const isExist = await this.findByID(id) as Album;

    if (!isExist) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    const album = this.dataStoreService.albums[id] as Album;

    this.dataStoreService.albums[id] = {
      ...album,
      ...data
    };

    return this.dataStoreService.albums[id]
  }

  public async deleteByID(id: string): Promise<boolean | HttpException> {
    const isExist = await this.findByID(id);

    if (!isExist) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    (await this.tracksService.findAll())
      .forEach(async (track: Track) => {
        if (track.albumId === id) {
          track.albumId = null
          await this.tracksService.updateByID(track.id, track)
        }
      });

    if (await this.favoritesService.isAddedInFavs(id, DataSourceTypes.Albums)) {
      await this.favoritesService.delete(id, DataSourceTypes.Albums);
    }

    return delete this.dataStoreService.albums[id];
  }

  public async hasEntityByID(id: string): Promise<boolean> {
    return await !!this.dataStoreService.albums[id];
  }
}
