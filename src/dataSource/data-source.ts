import * as dotenv from 'dotenv';
import { DataSourceOptions, DataSource } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { AlbumsEntity } from '../albums/entities/albums.entity';
import { ArtistsEntity } from '../artists/entities/artists.entity';
import { TracksEntity } from '../tracks/entities/tracks.entity';
import { FavoritesEntity } from '../favorites/entities/favorites.entity';
import { TokenEntity } from '../auth/tokens/entities/token.entity';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +(process.env.DB_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: true,
  // entities: [__dirname + '/**/*.entity{.ts,.js}'],
  // entities: ['dist/**/entity/*.js'],
  entities: [
    UserEntity,
    AlbumsEntity,
    TracksEntity,
    ArtistsEntity,
    FavoritesEntity,
    TokenEntity
  ],
  migrations: ['dist/dataSource/migrations/*.js'],
  migrationsRun: true
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
