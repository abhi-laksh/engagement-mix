import { get, post } from "../handler";
import { AUTH_ENDPOINTS } from "./constants";
import { AuthResponse, InitiateAuthDto, User, VerifyOtpDto } from "./types";

export const initiateAuth = async (data: InitiateAuthDto) =>
  await post<{ message: string }, InitiateAuthDto>(
    AUTH_ENDPOINTS.INITIATE,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

export const verifyOtp = async (data: VerifyOtpDto) =>
  await post<AuthResponse, VerifyOtpDto>(AUTH_ENDPOINTS.VERIFY_OTP, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const refresh = async (refreshToken: string) =>
  await get<{ accessToken: string }>(AUTH_ENDPOINTS.REFRESH, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${refreshToken}`,
    },
  });

export const getMe = async () => await get<User>(AUTH_ENDPOINTS.ME);
