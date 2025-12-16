import { Role, User } from '@prisma/client';
import { prisma } from '../db.js';
import { hashPassword } from '../utils/password.js';

type CreateUserInput = {
  email: string;
  name: string;
  password: string;
  role: Role;
};

export const createUser = async ({ email, name, password, role }: CreateUserInput) => {
  const passwordHash = await hashPassword(password);
  return prisma.user.create({
    data: { email, name, passwordHash, role },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
};

export const findByEmail = async (email: string) =>
  prisma.user.findUnique({ where: { email } });

export const listUsers = async () =>
  prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

export const updateUserRole = async (id: number, role: Role) =>
  prisma.user.update({ where: { id }, data: { role }, select: { id: true, email: true, name: true, role: true } });
