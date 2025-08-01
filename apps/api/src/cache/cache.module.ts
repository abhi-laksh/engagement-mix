import { Module } from '@nestjs/common';
import { AppConfigModule } from '../app-config/app-config.module';
import { CacheService } from './cache.service';

@Module({
  imports: [AppConfigModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}