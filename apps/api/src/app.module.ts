import { Module } from '@nestjs/common';
import { AppConfigModule } from './app-config/app-config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';

@Module({
  imports: [AppConfigModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
