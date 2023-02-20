import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { DataSourceService } from '../dataSource/dataSource.service';
import { Album } from './albums.interface';
import { ErrorMessages, DataSourceTypes } from '../constants';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';
import { AlbumsEntity } from './entities/albums.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AlbumsService {
  constructor(
    private readonly dataStoreService: DataSourceService,
    // @Inject(forwardRef(() => TracksService))
    // private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private dataSource: DataSource,
    @InjectRepository(AlbumsEntity)
    private albumsRepo: Repository<AlbumsEntity>
  ) {}

  public async findAll(): Promise<Album[]> {
    return this.albumsRepo.find();
  }

  public async create(data): Promise<any> {
    const album = new AlbumsEntity();
    album.artistId = data.artistId;
    album.name = data.name;
    album.year = data.year;

    return this.albumsRepo.save(album);
  }

  public async findByID(id: string): Promise<any> {
    const album = await this.albumsRepo.findOne({ where: { id }});

    if (!album) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return album
  }

  public async updateByID(id: string, data: any): Promise<any> {
    const album = await this.findByID(id) as Album;

    if (!album) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    const result = {...album, ...data}

    await this.albumsRepo.update(
      { id },
      result
    );

    return result
  }

  public async deleteByID(id: string): Promise<any | HttpException> {
    const isExist = await this.findByID(id);

    if (!isExist) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    if (await this.favoritesService.isAddedInFavs(id, DataSourceTypes.Albums)) {
      await this.favoritesService.delete(id, DataSourceTypes.Albums);
    }

    return await this.albumsRepo.delete({ id });
  }
}
