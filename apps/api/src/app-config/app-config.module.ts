/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppConfigService } from './app-config.service';

const configSchema = Joi.object({
  PORT: Joi.number().default(5000),
  DATABASE_URL: Joi.string().required(),
  CORS_ALLOWED_ORIGINS: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required(),

  // JWT CONFIG
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRY: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_EXPIRY: Joi.string().required(),
  DEFAULT_OTP_EXPIRATION: Joi.string().required(),
  OTP_LENGTH: Joi.number().required(),

  // EMAIL CONFIG
  SMTP_HOST: Joi.string(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USERNAME: Joi.string().allow('').default(''),
  SMTP_PASSWORD: Joi.string().allow('').default(''),
  FROM_EMAIL: Joi.string(),

});

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: configSchema,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
