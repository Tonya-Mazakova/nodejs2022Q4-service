import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSourceService } from '../dataSource/dataSource.service';
import { Track } from './tracks.interface';
import { v4 as uuid } from 'uuid';
import { ErrorMessages } from '../constants';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TracksService {
  constructor(
    private readonly dataStoreService: DataSourceService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  public async findAll(): Promise<Track[]> {
    return Object.values(this.dataStoreService.tracks)
  }

  public async create(data): Promise<any> {
    const track = {
      ...data,
      id: uuid(),
    } as Track;

    this.dataStoreService.tracks[track.id] = track;
    return track
  }

  public async findByID(id: string): Promise<any> {
    const track = await this.dataStoreService.tracks[id];

    if (!track) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return track
  }


  public async updateByID(id: string, data: any): Promise<any> {
    const isExist = await this.findByID(id) as Track;

    if (!isExist) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    const track = this.dataStoreService.tracks[id] as Track;

    this.dataStoreService.tracks[id] = {
      ...track,
      ...data
    };

    return this.dataStoreService.tracks[id]
  }

  public async deleteByID(id: string): Promise<boolean | HttpException> {
    const isExist = await this.findByID(id);

    if (!isExist) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    if (await this.favoritesService.isFavHasId(id, 'tracks')) {
      await this.favoritesService.delete(id, 'tracks');
    }

    return delete this.dataStoreService.tracks[id];
  }

  public async hasEntityByID(id: string): Promise<Track | undefined> {
    return await this.dataStoreService.tracks[id];
  }
}
