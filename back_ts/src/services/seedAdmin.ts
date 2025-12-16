import { Role } from '@prisma/client';
import { prisma } from '../db.js';
import { env } from '../config/env.js';
import { hashPassword } from '../utils/password.js';

export const ensureAdminUser = async () => {
  const existing = await prisma.user.findUnique({ where: { email: env.adminEmail } });
  if (existing) return existing;

  const passwordHash = await hashPassword(env.adminPassword);
  return prisma.user.create({
    data: {
      email: env.adminEmail,
      name: env.adminName,
      passwordHash,
      role: Role.ADMIN,
    },
  });
};
