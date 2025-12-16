import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export const requireRole = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return next();
};
