/**
 * RBAC: Permission keys that gate menu access and special actions.
 * Only Head Pastor can manage roles; users with manage_users can access Add Users.
 * Diocese and Circuit modules use their own permission sets.
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
  // Diocese module
  DIOCESE_CIRCUITS: 'diocese_circuits',
  DIOCESE_SUPERINTENDENTS: 'diocese_superintendents',
  DIOCESE_STATISTICS: 'diocese_statistics',
  DIOCESE_FINANCIAL_REPORTS: 'diocese_financial_reports',
  DIOCESE_PERFORMANCE: 'diocese_performance',
  // Circuit module
  CIRCUIT_SOCIETIES: 'circuit_societies',
  CIRCUIT_MINISTERS: 'circuit_ministers',
  CIRCUIT_MEMBERSHIP: 'circuit_membership',
  CIRCUIT_LEVIES: 'circuit_levies',
  CIRCUIT_FINANCE: 'circuit_finance',
  CIRCUIT_REPORTS: 'circuit_reports',
  CIRCUIT_BUDGET_APPROVALS: 'circuit_budget_approvals',
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
  [PERMISSIONS.DIOCESE_CIRCUITS]: 'Manage Circuits',
  [PERMISSIONS.DIOCESE_SUPERINTENDENTS]: 'Assign Superintendents',
  [PERMISSIONS.DIOCESE_STATISTICS]: 'Circuit Statistics',
  [PERMISSIONS.DIOCESE_FINANCIAL_REPORTS]: 'Financial Reports (Diocese)',
  [PERMISSIONS.DIOCESE_PERFORMANCE]: 'Circuit Performance',
  [PERMISSIONS.CIRCUIT_SOCIETIES]: 'Manage Societies',
  [PERMISSIONS.CIRCUIT_MINISTERS]: 'Assign Ministers',
  [PERMISSIONS.CIRCUIT_MEMBERSHIP]: 'Society Membership',
  [PERMISSIONS.CIRCUIT_LEVIES]: 'Society Levies',
  [PERMISSIONS.CIRCUIT_FINANCE]: 'Circuit Finance',
  [PERMISSIONS.CIRCUIT_REPORTS]: 'Society Reports',
  [PERMISSIONS.CIRCUIT_BUDGET_APPROVALS]: 'Budget Approvals',
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
  /** For circuit_admin: which circuit this user is scoped to */
  scopeCircuitId?: string;
}

export const SYSTEM_ROLE_IDS = {
  HEAD_PASTOR: 'head_pastor',
  CHURCH_ADMIN: 'church_admin',
  FINANCE_OFFICER: 'finance_officer',
  DIOCESE_ADMIN: 'diocese_admin',
  CIRCUIT_ADMIN: 'circuit_admin',
} as const;
