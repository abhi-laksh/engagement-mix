import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoiValidationPipe } from '../shared/pipes/joi-validation.pipe';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { InitiateAuthDto } from './dtos/initiate-auth.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { initiateAuthSchema } from './schemas/initiate-auth.schema';
import { verifyOtpSchema } from './schemas/verify-otp.schema';
import { JwtPayload } from './types/auth.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Post('initiate')
  @ApiOperation({ summary: 'Initiate authentication with email' })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    schema: {
      properties: {
        message: { type: 'string' },
        isNewUser: { type: 'boolean' },
      },
    },
  })
  @UsePipes(new JoiValidationPipe(initiateAuthSchema, 'body'))
  async initiateAuth(@Body() { email }: InitiateAuthDto) {
    return await this.authService.initiateAuth(email);
  }

  
  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and complete authentication' })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful',
  })
  @UsePipes(new JoiValidationPipe(verifyOtpSchema, 'body'))
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.authService.verifyOtp(verifyOtpDto);
  }

  @Get('refresh')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  async refresh(@GetUser() userFromToken: JwtPayload) {
    return await this.authService.refreshBothTokens(userFromToken);
  }

  @Get('refresh-access')
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshAccess(@GetUser() userFromToken: JwtPayload) {
    return await this.authService.refreshAccessToken(userFromToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@GetUser() userFromToken: JwtPayload) {
    const profile = await this.authService.getUserProfile(userFromToken.sub);
    return profile;
  }
}
