import { Module, forwardRef } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { TracksModule } from '../tracks/tracks.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { AlbumsModule } from '../albums/albums.module';

@Module({
  imports: [
    AlbumsModule,
    forwardRef(() => TracksModule),
    forwardRef(() => FavoritesModule)
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
