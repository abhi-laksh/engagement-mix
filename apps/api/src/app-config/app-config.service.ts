import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get app() {
    return {
      port: this.configService.get<number>('PORT') ?? 5000,
    };
  }

  get cors() {
    return {
      allowedOrigins: this.configService.get<string[]>('CORS_ALLOWED_ORIGINS'),
    };
  }

  get db() {
    return {
      url: this.configService.get<string>('DATABASE_URL'),
    };
  }

  get redis() {
    return {
      url: this.configService.get<string>('REDIS_URL'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    };
  }

  get email() {
    return {
      resendApiKey: this.configService.get<string>('RESEND_API_KEY'),
    };
  }
}
