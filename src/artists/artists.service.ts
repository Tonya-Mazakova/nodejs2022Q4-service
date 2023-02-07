import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSourceService } from '../dataSource/dataSource.service';
import { Artist } from './artists.interface';
import { v4 as uuid } from 'uuid';
import { ErrorMessages, DataSourceTypes } from '../constants';
import { Track } from '../tracks/tracks.interface';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';
import { AlbumsService } from '../albums/albums.service';
import { Album } from '../albums/albums.interface';

@Injectable()
export class ArtistsService {
  constructor(
    private readonly dataStoreService: DataSourceService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly albumsService: AlbumsService
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
      .forEach(async (track: Track) => {
        if (track.artistId === id) {
          track.artistId = null;
          await this.tracksService.updateByID(track.id, track)
        }
      });

    (await this.albumsService.findAll())
      .forEach(async (album: Album) => {
        if (album.artistId === id) {
          album.artistId = null
          await this.albumsService.updateByID(album.id, album)
        }
      });

    if (await this.favoritesService.isAddedInFavs(id, DataSourceTypes.Artists)) {
      await this.favoritesService.delete(id, DataSourceTypes.Artists);
    }

    return delete this.dataStoreService.artists[id]
  }

  public async hasEntityByID(id: string): Promise<boolean> {
    return await !!this.dataStoreService.artists[id];
  }
}
