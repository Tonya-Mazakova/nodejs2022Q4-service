import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import { AlbumsEntity } from '../../albums/entities/albums.entity';
import { ArtistsEntity } from '../../artists/entities/artists.entity';

@Entity()
export class TracksEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({
    type: String,
    unique: true,
    nullable: true,
  })
  albumId: string | null;

  @Column({
    type: String,
    unique: true,
    nullable: true,
  })
  artistId: string | null;

  @Column()
  duration: number;

  @ManyToOne(() => AlbumsEntity, (album) => album.id, {
    onDelete: 'SET NULL',
    onUpdate: "CASCADE",
    nullable: true,
  })
  album: AlbumsEntity;

  @ManyToOne(() => ArtistsEntity, (artist) => artist.id, {
    onDelete: 'SET NULL',
    onUpdate: "CASCADE",
    nullable: true,
  })
  artist: ArtistsEntity;
}
