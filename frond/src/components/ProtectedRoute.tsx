import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Role } from '../types';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, roles }: { children: ReactNode; roles?: Role[] }) => {
  const { isAuthenticated, user, hydrated } = useAuth();
  const location = useLocation();

  if (!hydrated) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
