/**
 * RBAC: Permission keys that gate menu access and special actions.
 * Only Head Pastor can manage roles; users with manage_users can access Add Users.
 */
export const PERMISSIONS = {
  DASHBOARD: 'dashboard',
  MEMBERS: 'members',
  ATTENDANCE: 'attendance',
  RECORD_INCOME: 'record_income',
  EXPENDITURE: 'expenditure',
  GENERATE_REPORT: 'generate_report',
  TITHES: 'tithes',
  COMMUNICATION: 'communication',
  ORGANIZATIONS_CLASSES: 'organizations_classes',
  ASSETS_EQUIPMENT: 'assets_equipment',
  MANAGE_ROLES: 'manage_roles',   // Role creation/management - Head Pastor only
  MANAGE_USERS: 'manage_users',  // Add Users menu
  SETTINGS: 'settings',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSION_KEYS: PermissionKey[] = Object.values(PERMISSIONS);

/** Human-readable labels for permissions (for Role Management UI) */
export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  [PERMISSIONS.DASHBOARD]: 'Dashboard',
  [PERMISSIONS.MEMBERS]: 'Members',
  [PERMISSIONS.ATTENDANCE]: 'Attendance',
  [PERMISSIONS.RECORD_INCOME]: 'Record Income',
  [PERMISSIONS.EXPENDITURE]: 'Expenditure',
  [PERMISSIONS.GENERATE_REPORT]: 'Generate Report',
  [PERMISSIONS.TITHES]: 'Tithes',
  [PERMISSIONS.COMMUNICATION]: 'Communication',
  [PERMISSIONS.ORGANIZATIONS_CLASSES]: 'Organizations/Classes',
  [PERMISSIONS.ASSETS_EQUIPMENT]: 'Assets/Equipment',
  [PERMISSIONS.MANAGE_ROLES]: 'Manage Roles (create/edit roles)',
  [PERMISSIONS.MANAGE_USERS]: 'Add Users (create/edit users)',
  [PERMISSIONS.SETTINGS]: 'Settings',
};

/** Role stored in localStorage; Head Pastor is super admin with all permissions */
export interface Role {
  id: string;
  name: string;
  permissions: PermissionKey[];
  isSystem?: boolean; // System roles (head_pastor, church_admin, finance_officer) cannot be deleted
}

/** Stored user (localStorage); password stored in plain text for demo only */
export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  roleId: string;
}

export const SYSTEM_ROLE_IDS = {
  HEAD_PASTOR: 'head_pastor',
  CHURCH_ADMIN: 'church_admin',
  FINANCE_OFFICER: 'finance_officer',
} as const;
