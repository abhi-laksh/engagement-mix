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
      fromEmail:
        this.configService.get<string>('FROM_EMAIL') ||
        'TaskMaster <hello@taskmaster.com>',
    };
  }

  get jwt() {
    return {
      accessTokenSecret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      refreshTokenSecret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      accessTokenExpiry:
        this.configService.get<string>('JWT_ACCESS_EXPIRY') ?? '15m',
      refreshTokenExpiry:
        this.configService.get<string>('JWT_REFRESH_EXPIRY') ?? '7d',
    };
  }

  get otp() {
    return {
      expiryTime: this.configService.get<number>('OTP_EXPIRY_TIME') ?? 300, // 5 minutes in seconds
      length: this.configService.get<number>('OTP_LENGTH') ?? 6,
    };
  }
}
