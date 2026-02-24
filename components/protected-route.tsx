'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/lib/auth-context';
import type { PermissionKey } from '@/lib/rbac-types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  allowedPermissions?: PermissionKey[];
}

export function ProtectedRoute({ children, allowedRoles, allowedPermissions }: ProtectedRouteProps) {
  const { isAuthenticated, user, hasPermission } = useAuth();
  const router = useRouter();

  const roleDenied = allowedRoles && user && !allowedRoles.some((r) => user.roleId === r);
  const permissionDenied =
    allowedPermissions && user && !allowedPermissions.some((p) => hasPermission(p));

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }
    if (roleDenied || permissionDenied) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, roleDenied, permissionDenied, router]);

  if (!isAuthenticated) {
    return null;
  }
  if (roleDenied || permissionDenied) {
    return null;
  }

  return <>{children}</>;
}


