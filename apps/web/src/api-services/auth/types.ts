export interface InitiateAuthDto {
  email: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
}