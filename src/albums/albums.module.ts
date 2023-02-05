import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { TracksModule } from '../tracks/tracks.modules';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService],
  imports: [TracksModule]
})
export class AlbumsModule {}
