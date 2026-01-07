'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'finance_officer' | 'church_admin' | 'head_pastor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing - In production, this would come from your backend
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'finance@church.com': {
    password: 'finance123',
    user: {
      id: '1',
      name: 'Finance Officer',
      email: 'finance@church.com',
      role: 'finance_officer',
      initials: 'FO',
    },
  },
  'admin@church.com': {
    password: 'admin123',
    user: {
      id: '2',
      name: 'Church Admin',
      email: 'admin@church.com',
      role: 'church_admin',
      initials: 'CA',
    },
  },
  'pastor@church.com': {
    password: 'pastor123',
    user: {
      id: '3',
      name: 'Head Pastor',
      email: 'pastor@church.com',
      role: 'head_pastor',
      initials: 'HP',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for stored auth on mount
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('church_admin_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('church_admin_user');
        }
      }
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // In production, this would be an API call
    // For demo purposes, we'll check against demo users
    const userData = DEMO_USERS[email.toLowerCase()];
    
    if (userData && userData.password === password && userData.user.role === role) {
      setUser(userData.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('church_admin_user', JSON.stringify(userData.user));
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
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
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


