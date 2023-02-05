import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { TracksModule } from '../tracks/tracks.modules';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService],
  imports: [TracksModule]
})
export class ArtistsModule {}
