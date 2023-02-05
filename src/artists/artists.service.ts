import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSourceService } from '../dataSource/dataSource.service';
import { Artist } from './artists.interface';
import { v4 as uuid } from 'uuid';
import { ErrorMessages } from '../constants';
import { Track } from '../tracks/tracks.interface';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class ArtistsService {
  constructor(
    private readonly dataStoreService: DataSourceService,
    private readonly tracksService: TracksService
  ) {}

  public async findAll(): Promise<Artist[]> {
    return Object.values(this.dataStoreService.artists)
  }

  public async create(data): Promise<any> {
    const artist = {
      ...data,
      id: uuid(),
    } as Artist;

    this.dataStoreService.artists[artist.id] = artist;

    return artist
  }

  public async findByID(id: string): Promise<any> {
    const artist = await this.dataStoreService.artists[id] as Artist;

    if (!artist) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return this.dataStoreService.artists[id]
  }

  public async updateByID(id: string, updatedData: any): Promise<any> {
    const artist = await this.findByID(id) as Artist;

    if (!artist) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    this.dataStoreService.artists[id] = {
      ...artist,
      ...updatedData
    }

    return this.dataStoreService.artists[id]
  }

  public async deleteByID(id: string): Promise<boolean> {
    const artist = await this.findByID(id);

    if (!artist) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    (await this.tracksService.findAll())
      .map((track: Track) => {
        if (track.artistId === id) {
          track.artistId = null
        }

        return track
      });

    return delete this.dataStoreService.artists[id]
  }
}
