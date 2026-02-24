'use client';

import {
  type Role,
  type StoredUser,
  PERMISSIONS,
  ALL_PERMISSION_KEYS,
  SYSTEM_ROLE_IDS,
} from './rbac-types';

const ROLES_STORAGE_KEY = 'church_admin_roles';
const USERS_STORAGE_KEY = 'church_admin_users';

function getDefaultRoles(): Role[] {
  return [
    {
      id: SYSTEM_ROLE_IDS.HEAD_PASTOR,
      name: 'Head Pastor',
      permissions: [...ALL_PERMISSION_KEYS],
      isSystem: true,
    },
    {
      id: SYSTEM_ROLE_IDS.CHURCH_ADMIN,
      name: 'Church Admin',
      permissions: [
        PERMISSIONS.DASHBOARD,
        PERMISSIONS.MEMBERS,
        PERMISSIONS.ATTENDANCE,
        PERMISSIONS.COMMUNICATION,
        PERMISSIONS.ORGANIZATIONS_CLASSES,
        PERMISSIONS.ASSETS_EQUIPMENT,
        PERMISSIONS.SETTINGS,
      ],
      isSystem: true,
    },
    {
      id: SYSTEM_ROLE_IDS.FINANCE_OFFICER,
      name: 'Finance Officer',
      permissions: [
        PERMISSIONS.DASHBOARD,
        PERMISSIONS.RECORD_INCOME,
        PERMISSIONS.EXPENDITURE,
        PERMISSIONS.GENERATE_REPORT,
        PERMISSIONS.TITHES,
        PERMISSIONS.SETTINGS,
      ],
      isSystem: true,
    },
  ];
}

export function getDefaultStoredUsers(): StoredUser[] {
  return [
    {
      id: '1',
      name: 'Finance Officer',
      email: 'finance@church.com',
      password: 'finance123',
      roleId: SYSTEM_ROLE_IDS.FINANCE_OFFICER,
    },
    {
      id: '2',
      name: 'Church Admin',
      email: 'admin@church.com',
      password: 'admin123',
      roleId: SYSTEM_ROLE_IDS.CHURCH_ADMIN,
    },
    {
      id: '3',
      name: 'Head Pastor',
      email: 'pastor@church.com',
      password: 'pastor123',
      roleId: SYSTEM_ROLE_IDS.HEAD_PASTOR,
    },
  ];
}

/** Get roles from localStorage; seed defaults if empty or missing */
export function getRoles(): Role[] {
  if (typeof window === 'undefined') return getDefaultRoles();
  try {
    const raw = localStorage.getItem(ROLES_STORAGE_KEY);
    if (!raw) {
      const defaults = getDefaultRoles();
      localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw) as Role[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const defaults = getDefaultRoles();
      localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return parsed;
  } catch {
    const defaults = getDefaultRoles();
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
}

/** Persist roles to localStorage */
export function saveRoles(roles: Role[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));
}

/** Get stored users; seed defaults if empty or missing */
export function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return getDefaultStoredUsers();
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      const defaults = getDefaultStoredUsers();
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw) as StoredUser[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const defaults = getDefaultStoredUsers();
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return parsed;
  } catch {
    const defaults = getDefaultStoredUsers();
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
}

/** Persist users to localStorage */
export function saveStoredUsers(users: StoredUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

/** Get role by id */
export function getRoleById(roleId: string): Role | undefined {
  return getRoles().find((r) => r.id === roleId);
}

/** Get permissions for a role (Head Pastor has all) */
export function getRolePermissions(roleId: string): string[] {
  if (!roleId) return [];
  if (roleId === SYSTEM_ROLE_IDS.HEAD_PASTOR) return ALL_PERMISSION_KEYS;
  const role = getRoleById(roleId);
  if (!role) return [];
  return Array.isArray(role.permissions) ? role.permissions : [];
}

/** Find stored user by email */
export function getStoredUserByEmail(email: string): StoredUser | undefined {
  return getStoredUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/** Generate a simple unique id */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
