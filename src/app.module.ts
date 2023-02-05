import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DataSourceModule } from './dataSource/dataSource.module';
import { TracksModule } from './tracks/tracks.modules';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule} from './albums/albums.module';

@Module({
  imports: [
    UsersModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    DataSourceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
