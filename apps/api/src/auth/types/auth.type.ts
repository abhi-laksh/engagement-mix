export interface Token {
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
}

export interface OtpPayload {
  otp: string;
  userId?: string;
  email?: string;
}
