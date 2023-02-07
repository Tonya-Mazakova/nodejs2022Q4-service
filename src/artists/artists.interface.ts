interface Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

interface IArtists {
  [index: string]: Artist
}

export { Artist, IArtists }
