import { create } from 'zustand';
import { eventDispatcher } from '../events/eventDispatcher';

/**
 * Represents the authentication state of the user.
 */
export interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userRoles: string[]; // Added userRoles
  userId: string | null;
  expiresAt: number | null;
  error: string | null;
  loading: boolean;
}

/**
 * Represents actions that can be performed on the authentication state.
 */
interface AuthActions {
  login: (accessToken: string, refreshToken: string, userId: string, roles: string[], expiresIn: number) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
}

/**
 * Combines AuthState and AuthActions into a single type for the store.
 */
type AuthStore = AuthState & AuthActions;

/**
 * Zustand store for managing authentication state.
 */
export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  accessToken: null,
  refreshToken: null,
  userRoles: [], // Initialize userRoles
  userId: null,
  expiresAt: null,
  error: null,
  loading: false,

  login: (accessToken, refreshToken, userId, roles, expiresIn) => {
    const expiresAt = Date.now() + expiresIn * 1000; // expiresIn is typically in seconds
    set({
      isLoggedIn: true,
      accessToken,
      refreshToken,
      userId,
      userRoles: roles, // Set userRoles on login
      expiresAt,
      error: null,
      loading: false,
    });
    eventDispatcher.dispatchEvent('AUTH_LOGIN', { userId, roles });
  },

  logout: () => {
    set({
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
      userRoles: [], // Clear userRoles on logout
      userId: null,
      expiresAt: null,
      error: null,
      loading: false,
    });
    eventDispatcher.dispatchEvent('AUTH_LOGOUT', {});
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  clearError: () => set({ error: null }),
  setAccessToken: (token) => set({ accessToken: token }),
  setRefreshToken: (token) => set({ refreshToken: token }),
}));
