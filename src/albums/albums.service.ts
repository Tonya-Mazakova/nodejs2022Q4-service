import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSourceService } from '../dataSource/dataSource.service';
import { ArtistsService } from '../artists/artists.service';
import { Album } from './albums.interface';
import { v4 as uuid } from 'uuid';
import { ErrorMessages } from '../constants';
import { User } from '../users/users.interface';
import { TracksService } from '../tracks/tracks.service';
import { Track } from '../tracks/tracks.interface';

@Injectable()
export class AlbumsService {
  constructor(
    private readonly dataStoreService: DataSourceService,
    private readonly tracksService: TracksService
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
    } else {
      return album
    }
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
    } else {
      (await this.tracksService.findAll())
        .map((track: Track) => {
          if (track.albumId === id) {
            track.albumId = null
          }

          return track
        });

      return delete this.dataStoreService.albums[id];
    }
  }
}
