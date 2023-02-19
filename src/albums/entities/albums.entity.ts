import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ArtistsEntity } from '../../artists/entities/artists.entity';

@Entity()
export class AlbumsEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => ArtistsEntity, (artist) => artist.id, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true
  })
  @JoinColumn({ name: 'artistId' })
  artist: ArtistsEntity;
}
