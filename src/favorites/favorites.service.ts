import { forwardRef, HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DataSourceService } from '../dataSource/dataSource.service';
import { TracksService } from '../tracks/tracks.service';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { ErrorMessages, DataSourceTypes } from '../constants';
import { FavoritesResponse } from './favorites.interface';
import { DataSource, Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoritesEntity } from './entities/favorites.entity';
import { TracksEntity } from '../tracks/entities/tracks.entity';
import { AlbumsEntity } from '../albums/entities/albums.entity';
import { ArtistsEntity } from '../artists/entities/artists.entity';

@Injectable()
export class FavoritesService implements OnModuleInit {
  constructor(
    private readonly dataStoreService: DataSourceService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    private dataSource: DataSource,
    @InjectRepository(FavoritesEntity)
    private favsRepo: Repository<FavoritesEntity>,
    @InjectRepository(TracksEntity)
    private tracksRepo: Repository<TracksEntity>,
    @InjectRepository(AlbumsEntity)
    private albumsRepo: Repository<AlbumsEntity>,
    @InjectRepository(ArtistsEntity)
    private artistsRepo: Repository<ArtistsEntity>
  ) {}

  async onModuleInit() {
    await this.initFavsRepo()
  }

  services = {
    tracks: this.tracksRepo,
    artists: this.artistsRepo,
    albums: this.albumsRepo
  }

  public async initFavsRepo() {
    const isExist = !!(await this.favsRepo.find()).length;

    if (isExist) {
      return
    }

    await this.favsRepo.save({
      tracks: [],
      albums: [],
      artists: []
    })
  }

  public async findAll(): Promise<any> {
    const { tracks, albums, artists } = (await this.favsRepo.createQueryBuilder("entity")
      .select(["tracks", "albums", "artists"])
      .getRawMany())[0];

    const favTracks = await this.tracksRepo.findBy({ id: In(tracks) });
    const favArtists = await this.artistsRepo.findBy({ id: In(artists) });
    const favAlbums = await this.albumsRepo.findBy({ id: In(albums) });

    return {
      tracks: favTracks || [],
      artists: favArtists || [],
      albums: favAlbums || []
    }
  }

  public async add(id: string, serviceType: DataSourceTypes): Promise<any> {
    const isExist = await this.services[serviceType].findOneById(id);

    if (isExist) {
      const favs = (await this.favsRepo.find())[0];
      favs[serviceType].push(id);

      await this.favsRepo.save({
        id: favs.id,
        ...favs,
      })
    } else {
      throw new HttpException(
        ErrorMessages.UNPROCESSABLE_ENTITY,
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }

  public async delete(id: string, type): Promise<any> {
    const favs = (await this.favsRepo.find())[0];

    const currentArr = favs[type];
    const index = currentArr.indexOf(id);

    if (index === -1) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    currentArr.splice(index, 1);

    await this.favsRepo.save({
      ...favs,
      [type]: currentArr
    });

    return true
  }

  public async isAddedInFavs(id: string, type): Promise<boolean> {
    const data = (await this.favsRepo.createQueryBuilder("entity")
      .select([type])
      .getRawMany())[0];

    return data[type]?.includes(id)
  }
}
