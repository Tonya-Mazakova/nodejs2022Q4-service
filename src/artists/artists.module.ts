import { Module, forwardRef } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { TracksModule } from '../tracks/tracks.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { AlbumsModule } from '../albums/albums.module';
import { ArtistsEntity } from './entities/artists.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AlbumsModule,
    forwardRef(() => TracksModule),
    forwardRef(() => FavoritesModule),
    TypeOrmModule.forFeature([ArtistsEntity])
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService, TypeOrmModule],
})
export class ArtistsModule {}
