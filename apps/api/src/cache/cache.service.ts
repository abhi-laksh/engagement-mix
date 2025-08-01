import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private redis: Redis;

  constructor(private readonly configService: AppConfigService) {
    this.initializeRedis();
  }

  private initializeRedis() {
    try {
      const redisConfig = this.configService.redis;
      
      if (!redisConfig.url) {
        this.logger.warn('Redis URL not found. Cache service will not work properly.');
        return;
      }

      this.redis = new Redis(redisConfig.url, {
        password: redisConfig.password,
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
      });

      this.redis.on('connect', () => {
        this.logger.log('Connected to Redis');
      });

      this.redis.on('error', (error) => {
        this.logger.error('Redis connection error:', error);
      });

    } catch (error) {
      this.logger.error('Failed to initialize Redis:', error);
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    try {
      if (!this.redis) {
        this.logger.error('Redis is not initialized. Cannot set value.');
        return false;
      }

      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, value);
      } else {
        await this.redis.set(key, value);
      }

      return true;
    } catch (error) {
      this.logger.error(`Failed to set cache key ${key}:`, error);
      return false;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!this.redis) {
        this.logger.error('Redis is not initialized. Cannot get value.');
        return null;
      }

      return await this.redis.get(key);
    } catch (error) {
      this.logger.error(`Failed to get cache key ${key}:`, error);
      return null;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      if (!this.redis) {
        this.logger.error('Redis is not initialized. Cannot delete value.');
        return false;
      }

      const result = await this.redis.del(key);
      return result > 0;
    } catch (error) {
      this.logger.error(`Failed to delete cache key ${key}:`, error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!this.redis) {
        this.logger.error('Redis is not initialized. Cannot check existence.');
        return false;
      }

      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to check existence of cache key ${key}:`, error);
      return false;
    }
  }

  async setOtp(email: string, otp: string, ttlSeconds: number): Promise<boolean> {
    const key = `otp:${email}`;
    return this.set(key, otp, ttlSeconds);
  }

  async getOtp(email: string): Promise<string | null> {
    const key = `otp:${email}`;
    return this.get(key);
  }

  async deleteOtp(email: string): Promise<boolean> {
    const key = `otp:${email}`;
    return this.delete(key);
  }

  async setRefreshToken(userId: string, token: string, ttlSeconds: number): Promise<boolean> {
    const key = `refresh_token:${userId}`;
    return this.set(key, token, ttlSeconds);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    const key = `refresh_token:${userId}`;
    return this.get(key);
  }

  async deleteRefreshToken(userId: string): Promise<boolean> {
    const key = `refresh_token:${userId}`;
    return this.delete(key);
  }

  onModuleDestroy() {
    if (this.redis) {
      this.redis.disconnect();
      this.logger.log('Disconnected from Redis');
    }
  }
}