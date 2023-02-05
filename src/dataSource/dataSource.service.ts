import { Injectable } from '@nestjs/common';
import { IUsers } from '../users/users.interface';
import { ITracks } from '../tracks/tracks.interface';
import { IArtists } from '../artists/artists.interface';
import { IAlbums } from '../albums/albums.interface';

@Injectable()
export class DataSourceService {
  users: IUsers = {}
  tracks: ITracks = {}
  artists: IArtists = {}
  albums: IAlbums = {}
}
