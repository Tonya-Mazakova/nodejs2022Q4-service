import { Artist } from '../artists/artists.interface';
import { Album } from '../albums/albums.interface';
import { Track } from '../tracks/tracks.interface';

interface Favorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

interface FavoritesRepsonse{
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

export { Favorites, FavoritesRepsonse }
