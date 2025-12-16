import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env.js';

type Payload = {
  id: number;
  email: string;
  role: Role;
  name: string;
};

export const signToken = (payload: Payload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: '8h' });

export const verifyToken = (token: string) =>
  jwt.verify(token, env.jwtSecret) as Payload;
