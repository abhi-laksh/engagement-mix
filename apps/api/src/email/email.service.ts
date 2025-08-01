import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

export interface SendOtpEmailOptions {
  email: string;
  otp: string;
  isNewUser: boolean;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(options: ISendMailOptions): Promise<void> {
    await this.mailerService.sendMail(options);
  }

  async sendOtpEmail({
    email,
    otp,
    isNewUser,
  }: SendOtpEmailOptions): Promise<boolean> {
    try {
      const subject = isNewUser
        ? 'Welcome to TaskMaster - Verify your email'
        : 'TaskMaster - Your login code';

      const html = this.generateOtpEmailTemplate({
        otp,
        isNewUser,
        email,
      });

      const result = await this.mailerService.sendMail({
        to: [email],
        subject,
        html,
      });

      if (result.error) {
        this.logger.error('Failed to send OTP email', result.error);
        return false;
      }

      this.logger.log(`OTP email sent successfully to ${email}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending OTP email', error);
      return false;
    }
  }

  private generateOtpEmailTemplate({
    otp,
    isNewUser,
    email,
  }: {
    otp: string;
    isNewUser: boolean;
    email: string;
  }): string {
    const welcomeMessage = isNewUser
      ? `<h2>Welcome to TaskMaster!</h2>
         <p>We're excited to have you on board. Please verify your email address to get started.</p>`
      : `<h2>Welcome back!</h2>
         <p>Here's your login code for TaskMaster.</p>`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>TaskMaster - Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TaskMaster</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            ${welcomeMessage}
            
            <div style="background: white; padding: 25px; margin: 25px 0; border-radius: 8px; text-align: center; border: 2px solid #667eea;">
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #666;">Your verification code is:</p>
              <h1 style="font-size: 36px; color: #667eea; letter-spacing: 8px; margin: 0; font-weight: bold;">${otp}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 20px 0;">
              This code will expire in 5 minutes for security reasons.
            </p>
            
            <p style="color: #666; font-size: 14px;">
              If you didn't request this code, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              This email was sent to ${email}.<br>
              TaskMaster - Organize your tasks, achieve your goals.
            </p>
          </div>
        </body>
      </html>
    `;
  }
}
