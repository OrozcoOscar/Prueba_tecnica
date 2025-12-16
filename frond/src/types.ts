export type Role = 'ADMIN' | 'OPERATOR';

export type User = {
  id: number;
  email: string;
  name: string;
  role: Role;
  createdAt?: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
