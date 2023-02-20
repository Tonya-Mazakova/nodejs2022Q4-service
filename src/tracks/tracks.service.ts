import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSourceService } from '../dataSource/dataSource.service';
import { Track } from './tracks.interface';
import { ErrorMessages, DataSourceTypes } from '../constants';
import { FavoritesService } from '../favorites/favorites.service';
import { TracksEntity } from './entities/tracks.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TracksService {
  constructor(
    private readonly dataStoreService: DataSourceService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private dataSource: DataSource,
    @InjectRepository(TracksEntity)
    private tracksRepo: Repository<TracksEntity>
  ) {}

  public async findAll(): Promise<Track[]> {
    return this.tracksRepo.find();
  }

  public async create(data): Promise<any> {
    const track = new TracksEntity();
    track.albumId = data.albumId;
    track.artistId = data.artistId;
    track.duration = data.duration;
    track.name = data.name;

    return this.tracksRepo.save(track);
  }

  public async findByID(id: string): Promise<any> {
    const track = await this.tracksRepo.findOne({ where: { id }});

    if (!track) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return track
  }

  public async updateByID(id: string, data: any): Promise<any> {
    const track = await this.findByID(id) as Track;

    if (!track) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    const result = {...track, ...data};

    await this.tracksRepo.update(
      { id },
      result
    );

    return result;
  }

  public async deleteByID(id: string): Promise<any | HttpException> {
    const track = await this.findByID(id);

    if (!track) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    if (await this.favoritesService.isAddedInFavs(id, DataSourceTypes.Tracks)) {
      await this.favoritesService.delete(id, DataSourceTypes.Tracks);
    }

    return await this.tracksRepo.delete({ id });
  }
}
