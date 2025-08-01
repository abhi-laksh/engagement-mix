import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppConfigService } from 'src/app-config/app-config.service';
import { AppConfigModule } from '../app-config/app-config.module';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        transport: {
          host: config.email.host,
          port: config.email.port,
          secure: false,
          ...(config.email.username && config.email.password
            ? {
                auth: {
                  user: config.email.username,
                  pass: config.email.password,
                },
              }
            : {}),
        },
        defaults: {
          from: config.email.fromEmail,
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
