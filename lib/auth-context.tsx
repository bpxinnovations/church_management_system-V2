'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  getStoredUsers,
  getRoleById,
  getRolePermissions,
  getDefaultStoredUsers,
  saveStoredUsers,
} from './rbac-storage';
import type { PermissionKey } from './rbac-types';
import { SYSTEM_ROLE_IDS } from './rbac-types';

/** Legacy role names for backward compatibility (hasRole checks) */
export type UserRole = 'finance_officer' | 'church_admin' | 'head_pastor';

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  initials: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: PermissionKey) => boolean;
  refreshUser: () => void; // Re-load user from storage (e.g. after role/user updates)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toUser(stored: { id: string; name: string; email: string; roleId: string }): User {
  const role = getRoleById(stored.roleId);
  const roleName = role?.name ?? stored.roleId;
  const initials =
    stored.name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  return {
    id: stored.id,
    name: stored.name,
    email: stored.email,
    roleId: stored.roleId,
    roleName,
    initials,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('church_admin_user');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as User & { role?: string };
      // Migrate legacy stored user (had "role" string) to roleId/roleName
      const roleId = parsed.roleId ?? parsed.role ?? '';
      const role = getRoleById(roleId);
      const roleName = role?.name ?? parsed.roleName ?? String(parsed.role ?? '').replace(/_/g, ' ');
      const userObj: User = {
        id: parsed.id,
        name: parsed.name,
        email: parsed.email,
        roleId,
        roleName,
        initials: parsed.initials ?? '',
      };
      setUser(userObj);
      localStorage.setItem('church_admin_user', JSON.stringify(userObj));
    } catch {
      localStorage.removeItem('church_admin_user');
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    const storedUsers = getStoredUsers();
    let stored = storedUsers.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    );
    if (!stored) {
      const defaults = getDefaultStoredUsers();
      stored = defaults.find(
        (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
      );
      if (stored && typeof window !== 'undefined') {
        if (!storedUsers.some((u) => u.email.toLowerCase() === normalizedEmail)) {
          saveStoredUsers([...storedUsers, stored]);
        }
      }
    }
    if (stored) {
      const userObj = toUser(stored);
      setUser(userObj);
      if (typeof window !== 'undefined') {
        localStorage.setItem('church_admin_user', JSON.stringify(userObj));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('church_admin_user');
    }
    router.push('/signin');
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.some((r) => user.roleId === r);
  };

  const hasPermission = (permission: PermissionKey): boolean => {
    if (!user) return false;
    const perms = getRolePermissions(user.roleId) ?? [];
    return perms.includes(permission);
  };

  const refreshUser = () => {
    if (typeof window === 'undefined' || !user) return;
    const storedUsers = getStoredUsers();
    const stored = storedUsers.find((u) => u.id === user.id);
    if (stored) {
      const next = toUser(stored);
      setUser(next);
      localStorage.setItem('church_admin_user', JSON.stringify(next));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
        hasPermission,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
