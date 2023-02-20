import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSourceService } from '../dataSource/dataSource.service';
import { Artist } from './artists.interface';
import { ErrorMessages, DataSourceTypes } from '../constants';
import { Track } from '../tracks/tracks.interface';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';
import { AlbumsService } from '../albums/albums.service';
import { Album } from '../albums/albums.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ArtistsEntity } from './entities/artists.entity';

@Injectable()
export class ArtistsService {
  constructor(
    private readonly dataStoreService: DataSourceService,
    // @Inject(forwardRef(() => TracksService))
    // private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly albumsService: AlbumsService,
    private dataSource: DataSource,
    @InjectRepository(ArtistsEntity)
    private artistsRepo: Repository<ArtistsEntity>
  ) {}

  public async findAll(): Promise<Artist[]> {
    return this.artistsRepo.find();
  }

  public async create(data): Promise<any> {
    const artist = new ArtistsEntity();
    artist.grammy = data.grammy;
    artist.name = data.name;

    return this.artistsRepo.save(artist);
  }

  public async findByID(id: string): Promise<any> {
    const artist = await this.artistsRepo.findOne({ where: { id }});

    if (!artist) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return artist;
  }

  public async updateByID(id: string, updatedData: any): Promise<any> {
    const artist = await this.findByID(id) as Artist;

    if (!artist) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    const result = {...artist, ...updatedData}

    await this.artistsRepo.update(
      { id },
      result
    );

    return result
  }

  public async deleteByID(id: string): Promise<any> {
    const artist = await this.findByID(id);

    if (!artist) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    if (await this.favoritesService.isAddedInFavs(id, DataSourceTypes.Artists)) {
      await this.favoritesService.delete(id, DataSourceTypes.Artists);
    }

    return await this.artistsRepo.delete({ id })
  }
}
