import { Module, forwardRef } from '@nestjs/common';
import { TracksModule } from '../tracks/tracks.module';
import { ArtistsModule } from '../artists/artists.module';
import { AlbumsModule } from '../albums/albums.module';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { FavoritesEntity } from './entities/favorites.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    forwardRef(() => TracksModule),
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
    TypeOrmModule.forFeature([FavoritesEntity])
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [
    FavoritesService,
    TypeOrmModule
  ]
})
export class FavoritesModule {}
