import KeyvRedis from '@keyv/redis';
import { Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { AppConfigService } from 'src/app-config/app-config.service';
import { AppConfigModule } from '../app-config/app-config.module';
import { CacheService } from './cache.service';

@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: (appConfig: AppConfigService) => {
        
        const redisUrl = `${appConfig.redis.url}${appConfig.redis.password ? `?password=${appConfig.redis.password}` : ''}`;

        const secondary = new KeyvRedis(redisUrl);
        return new Cacheable({
          secondary,
          nonBlocking: true, // For better performance
        });
      },
      inject: [AppConfigService],
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
