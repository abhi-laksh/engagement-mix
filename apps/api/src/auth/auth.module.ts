import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from '../app-config/app-config.module';
import { CacheModule } from '../cache/cache.module';
import { EmailModule } from '../email/email.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { User, UserSchema } from './schemas/user.schema';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    AppConfigModule,
    CacheModule,
    EmailModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy, RefreshTokenStrategy],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}