import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSourceService } from '../dataSource/dataSource.service';
import { ArtistsService } from '../artists/artists.service';
import { Track } from './tracks.interface';
import { v4 as uuid } from 'uuid';
import { ErrorMessages } from '../constants';
import { User } from '../users/users.interface';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class TracksService {
  constructor(
    private readonly dataStoreService: DataSourceService,
    // private readonly artistsService: ArtistsService
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
    } else {
      return track
    }
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
    } else

      return delete this.dataStoreService.tracks[id];
    }
}
