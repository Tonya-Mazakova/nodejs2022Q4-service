import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DataSourceModule } from './dataSource/dataSource.module';

@Module({
  imports: [
    UsersModule,
    DataSourceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
