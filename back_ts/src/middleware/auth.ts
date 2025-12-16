import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
