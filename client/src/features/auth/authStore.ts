import { create } from 'zustand';
import { login as loginApi } from './auth.api';
import type { AuthResponse } from './auth.api';

interface AuthState {
  user: AuthResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

function getInitialAuth(): { token: string | null; user: AuthResponse['user'] | null } {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (token && user) {
    return { token, user: JSON.parse(user) };
  }
  return { token: null, user: null };
}

const initial = getInitialAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: initial.user,
  token: initial.token,
  isAuthenticated: !!initial.token,

  login: async (email: string, password: string) => {
    const data = await loginApi(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    set({ token: data.token, user: data.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
