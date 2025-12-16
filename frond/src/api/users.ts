import api from './client';
import { Role, User } from '../types';

type CreateUserPayload = {
  email: string;
  name: string;
  password: string;
  role: Role;
};

type UpdateRolePayload = {
  role: Role;
};

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>('/api/users');
  return data;
};

export const createUserRequest = async (payload: CreateUserPayload) => {
  const { data } = await api.post<User>('/api/users', payload);
  return data;
};

export const updateUserRoleRequest = async (id: number, payload: UpdateRolePayload) => {
  const { data } = await api.patch<User>(`/api/users/${id}/role`, payload);
  return data;
};
