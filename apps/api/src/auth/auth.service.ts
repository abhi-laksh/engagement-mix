import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'node:crypto';
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
    console.log('existingUser', existingUser);
    // Generate OTP
    const otp = this.generateOTP();

    const otpKey = this.getOtpKey(email);

    const otpPayload: OtpPayload = {
      otp,
      userId: existingUser?._id?.toString(),
      email,
    };

    // Store OTP data in cache
    await this.cacheService.set(
      otpKey,
      otpPayload,
      this.appConfigService.otp.expiryTime * 1000,
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
    console.log('storedData', storedData, otp);
    if (storedData?.otp !== otp) {
      throw new ForbiddenException('Invalid OTP');
    }

    let userId: string;

    if (!storedData.userId) {
      const user = await this.authRepository.createUser(email);
      userId = user._id?.toString() as string;
    } else {
      userId = storedData.userId;
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.createToken({ sub: userId, email }, 'access'),
      this.createToken({ sub: userId, email }, 'refresh'),
      this.cacheService.delete(otpKey),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(userFromToken: JwtPayload) {
    const user = await this.authRepository.findById(userFromToken.sub);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      accessToken: await this.createToken(userFromToken, 'access'),
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

  private async createToken(
    payload: Omit<JwtPayload, 'type'>,
    type: 'access' | 'refresh',
  ): Promise<string> {
    const secret =
      type === 'access'
        ? this.appConfigService.jwt.accessTokenSecret
        : this.appConfigService.jwt.refreshTokenSecret;

    const expiresIn =
      type === 'access'
        ? this.appConfigService.jwt.accessTokenExpiry
        : this.appConfigService.jwt.refreshTokenExpiry;

    return await this.jwtService.signAsync(
      { sub: payload.sub, email: payload.email, type },
      {
        secret,
        expiresIn,
      },
    );
  }
}
