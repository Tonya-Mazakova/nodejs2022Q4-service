import { Module, forwardRef } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { TracksModule } from '../tracks/tracks.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { AlbumsEntity } from './entities/albums.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    forwardRef(() => TracksModule),
    forwardRef(() => FavoritesModule),
    TypeOrmModule.forFeature([AlbumsEntity])
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [
    AlbumsService,
    TypeOrmModule
  ],
})
export class AlbumsModule {}
