import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import {
  getMe,
  initiateAuth,
  refresh,
  verifyOtp
} from "./requests";
import { AuthResponse, InitiateAuthDto, User, VerifyOtpDto } from "./types";


export function useInitiateAuth() {
  return useMutation<
    { message: string },
    unknown,
    InitiateAuthDto
  >({
    mutationFn: async (data) => {
      const response = await initiateAuth(data);
      return response.data;
    },
  });
}

export function useVerifyOtp() {
  const setTokens = useAuthStore((state) => state.setTokens);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  
  return useMutation<AuthResponse, unknown, VerifyOtpDto>({
    mutationFn: async (data) => {
      const response = await verifyOtp(data);
      return response.data;
    },
    onSuccess: (authResponse) => {
      setTokens(authResponse.accessToken, authResponse.refreshToken);
    },
    onError: () => {
      clearAuth();
    },
  });
}

export function useRefresh() {
  const updateAccessToken = useAuthStore((state) => state.updateAccessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  
  return useMutation<{ accessToken: string }, unknown, void>({
    mutationFn: async () => {
      const response = await refresh();
      return response.data;
    },
    onSuccess: (data) => {
      updateAccessToken(data.accessToken);
    },
    onError: () => {
      clearAuth();
    },
  });
}

export function useMe(options?: any) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await getMe();
      return response.data;
    },
    ...options,
  });
}

// Hook that automatically updates the store when user data is fetched
export function useMeWithStore(options?: any) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  
  return useMutation<User, unknown, void>({
    mutationFn: async () => {
      const response = await getMe();
      return response.data;
    },
    onSuccess: (userData: User) => {
      setUser(userData);
    },
    onError: () => {
      clearAuth();
    },
  });
}
