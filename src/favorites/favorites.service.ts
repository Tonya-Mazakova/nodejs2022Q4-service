import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSourceService } from '../dataSource/dataSource.service';
import { TracksService } from '../tracks/tracks.service';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { ErrorMessages, DataSourceTypes } from '../constants';
import { FavoritesResponse } from './favorites.interface';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly dataStoreService: DataSourceService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
  ) {}

  services = {
    tracks: this.tracksService,
    artists: this.artistsService,
    albums: this.albumsService
  }

  public async findAll(): Promise<FavoritesResponse> {
    const tracks = await this.tracksService.findAll();
    const artists = await this.artistsService.findAll();
    const albums = await this.albumsService.findAll();

    const favTracks = this.dataStoreService
      .favorites
      .tracks
      .map((trackID) => tracks?.find((track) => track?.id === trackID));

    const favArtists = this.dataStoreService
      .favorites
      .artists
      .map((artistID) => artists?.find((artist) => artist?.id === artistID));

    const favAlbums = this.dataStoreService
      .favorites
      .albums
      .map((albumID) => albums?.find((album) => album?.id === albumID));

    return {
      tracks: favTracks || [],
      artists: favArtists || [],
      albums: favAlbums || []
    }
  }

  public async add(id: string, serviceType: DataSourceTypes): Promise<any> {
    const isExist = await this.services[serviceType].hasEntityByID(id);

    if (isExist) {
      this.dataStoreService.favorites[serviceType].push(id);
    } else {
      throw new HttpException(
        ErrorMessages.UNPROCESSABLE_ENTITY,
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }

  public async delete(id: string, type): Promise<boolean> {
    const arr = await this.dataStoreService.favorites[type];

    if (!arr.includes(id)) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    this.dataStoreService.favorites[type] =
      [...this.dataStoreService.favorites[type]]?.filter((itemID: string) => itemID !== id)

    return true
  }

  public async isAddedInFavs(id: string, type): Promise<boolean> {
    return await this.dataStoreService.favorites[type].includes(id)
  }
}
