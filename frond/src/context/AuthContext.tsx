import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { loginRequest } from '../api/auth';
import { setAuthToken } from '../api/client';
import { AuthResponse, Role, User } from '../types';

type AuthState = {
  user?: User;
  token?: string;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

const storageKey = 'user-mgmt-auth';

type StoredAuth = {
  token: string;
  user: User;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return undefined;
    try {
      const parsed = JSON.parse(raw) as StoredAuth;
      setAuthToken(parsed.token);
      return parsed.user;
    } catch (error) {
      console.error('Error parsing stored auth', error);
      localStorage.removeItem(storageKey);
      return undefined;
    }
  });
  const [token, setToken] = useState<string | undefined>(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return undefined;
    try {
      const parsed = JSON.parse(raw) as StoredAuth;
      return parsed.token;
    } catch {
      return undefined;
    }
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const login = async (email: string, password: string) => {
    const data: AuthResponse = await loginRequest({ email, password });
    setUser(data.user);
    setToken(data.token);
    setAuthToken(data.token);
    localStorage.setItem(storageKey, JSON.stringify({ token: data.token, user: data.user }));
  };

  const logout = () => {
    setUser(undefined);
    setToken(undefined);
    setAuthToken(undefined);
    localStorage.removeItem(storageKey);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: Boolean(user), hydrated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

export const useHasRole = (roles: Role[]) => {
  const { user } = useAuth();
  return user ? roles.includes(user.role) : false;
};
