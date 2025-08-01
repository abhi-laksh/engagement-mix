import { AuthResponse, User } from '@/api-services/auth';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setAuth: (authResponse: AuthResponse, user: User) => void;
  setAuthWithTokens: (accessToken: string, refreshToken: string, user: User) => void;
  clearAuth: () => void;
  updateAccessToken: (accessToken: string) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setTokens: (accessToken: string, refreshToken: string) => {
          set(
            (state) => ({
              ...state,
              accessToken,
              refreshToken,
              isAuthenticated: true,
            }),
            false,
            'setTokens'
          );
        },

        setUser: (user: User) => {
          set(
            (state) => ({
              ...state,
              user,
            }),
            false,
            'setUser'
          );
        },

        setAuth: (authResponse: AuthResponse, user: User) => {
          set(
            {
              accessToken: authResponse.accessToken,
              refreshToken: authResponse.refreshToken,
              user,
              isAuthenticated: true,
            },
            false,
            'setAuth'
          );
        },

        setAuthWithTokens: (accessToken: string, refreshToken: string, user: User) => {
          set(
            {
              accessToken,
              refreshToken,
              user,
              isAuthenticated: true,
            },
            false,
            'setAuthWithTokens'
          );
        },

        clearAuth: () => {
          set(initialState, false, 'clearAuth');
        },

        updateAccessToken: (accessToken: string) => {
          set(
            (state) => ({
              ...state,
              accessToken,
            }),
            false,
            'updateAccessToken'
          );
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);