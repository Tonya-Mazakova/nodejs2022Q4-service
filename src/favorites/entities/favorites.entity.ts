import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class FavoritesEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { array: true })
  artists: string[];

  @Column("text", { array: true })
  albums: string[];

  @Column("text", { array: true })
  tracks: string[];
}
