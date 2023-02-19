import { forwardRef, Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { FavoritesModule } from '../favorites/favorites.module';
import { TracksEntity } from './entities/tracks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    forwardRef(() => FavoritesModule),
    TypeOrmModule.forFeature([TracksEntity])
  ],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService, TypeOrmModule],
})

export class TracksModule {}
