import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import { z } from 'zod';
import { createUser, listUsers, updateUserRole } from '../services/userService.js';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
});

const updateRoleSchema = z.object({
  role: z.nativeEnum(Role),
});

export const createUserHandler = async (req: Request, res: Response) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.errors });
  }

  const user = await createUser(parsed.data);
  return res.status(201).json(user);
};

export const listUsersHandler = async (_req: Request, res: Response) => {
  const users = await listUsers();
  return res.json(users);
};

export const updateRoleHandler = async (req: Request, res: Response) => {
  const parsed = updateRoleSchema.safeParse(req.body);
  const id = Number(req.params.id);

  if (!parsed.success || Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  const updated = await updateUserRole(id, parsed.data.role);
  return res.json(updated);
};
