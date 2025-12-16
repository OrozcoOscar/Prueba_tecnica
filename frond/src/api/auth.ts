import api from './client';
import { AuthResponse } from '../types';

type LoginPayload = {
  email: string;
  password: string;
};

export const loginRequest = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/api/auth/login', payload);
  return data;
};
