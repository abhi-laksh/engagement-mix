import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto';
import { AppConfigService } from '../app-config/app-config.service';
import { CacheService } from '../cache/cache.service';
import { EmailService } from '../email/email.service';
import { AuthRepository } from './auth.repository';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { JwtPayload, OtpPayload } from './types/auth.type';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly cacheService: CacheService,
    private readonly emailService: EmailService,
    private readonly appConfigService: AppConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async initiateAuth(email: string) {
    this.logger.log(`Initiating auth for email: ${email}`);

    // Check if user exists
    const existingUser = await this.authRepository.findByEmail(email);
    
    // Generate OTP
    const otp = this.generateOTP();

    const otpKey = this.getOtpKey(email);

    const otpPayload: OtpPayload = {
      otp,
      userId: existingUser?.id as string,
      email,
    };

    // Store OTP data in cache
    await this.cacheService.set(
      otpKey,
      otpPayload,
      this.appConfigService.otp.expiryTime,
    );

    // Send OTP via email
    try {
      await this.emailService.sendOtpEmail({
        email,
        isNewUser: !existingUser,
        otp,
      });
    } catch (error) {
      console.log('Error sending OTP:', error);
      throw new UnauthorizedException('Failed to send OTP');
    }

    return {
      message: 'OTP sent successfully',
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;
    const otpKey = this.getOtpKey(email);

    // Get stored OTP data
    const storedData = await this.cacheService.get<OtpPayload>(otpKey);

    if (!storedData || storedData.otp !== otp) {
      throw new ForbiddenException('Invalid OTP');
    }

    let userId: string;
    let newUser = false;
    if (!storedData.userId) {
      const user = await this.authRepository.createUser(email);
      userId = user.id;
      newUser = true;
    } else {
      userId = storedData.userId;
    }

    // Delete OTP from cache
    await this.cacheService.delete(otpKey);

    return {
      tokens: await this.createTokens({
        sub: userId,
        email,
      }),
    };
  }

  async refreshBothTokens(userFromToken: JwtPayload) {
    try {
      if (!userFromToken.sub || !userFromToken.type) {
        throw new ForbiddenException('Invalid token');
      }

      const user = await this.authRepository.findById(userFromToken.sub);

      if (!user) {
        throw new ForbiddenException('Invalid token');
      }

      return {
        tokens: await this.createTokens({
          sub: user.id,
          email: user.email,
        }),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async refreshAccessToken(userFromToken: JwtPayload) {
    const user = await this.authRepository.findById(userFromToken.sub);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      accessToken: await this.createAccessToken(userFromToken),
    };
  }

  async getUserProfile(userId: string) {
    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

  private getOtpKey(email: string) {
    return `auth:${email}`;
  }

  private generateOTP(): string {
    const otpLength = this.appConfigService.otp.length;
    const min = 10 ** (otpLength - 1);
    const max = 10 ** otpLength - 1;

    return crypto.randomInt(min, max + 1).toString();
  }

  private async createAccessToken(
    payload: Omit<JwtPayload, 'type'>,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      { ...payload, type: 'access' },
      {
        expiresIn: this.appConfigService.jwt.accessTokenExpiry,
      },
    );
  }

  private async createRefreshToken(
    payload: Omit<JwtPayload, 'type'>,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      { ...payload, type: 'refresh' },
      {
        expiresIn: this.appConfigService.jwt.refreshTokenExpiry,
      },
    );
  }

  private async createTokens(payload: Omit<JwtPayload, 'type'>) {
    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(payload),
      this.createRefreshToken(payload),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
