import { Module, Global } from '@nestjs/common';
import { DataSourceService } from './dataSource.service';

@Global()
@Module({
  providers: [DataSourceService],
  exports: [DataSourceService],
})
export class DataSourceModule {}
