interface Album {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}

interface IAlbums {
  [index: string]: Album
}

export { Album, IAlbums }
