// Mock Data for IoT Admin Panel

// Types
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'inactive';
export type AccountStatus = 'enabled' | 'disabled';
export type DeviceStatus = 'active' | 'offline' | 'inactive';
export type AdminRole = 'owner' | 'admin' | 'support';
export type LogAction = 'device_unlock' | 'login_attempt' | 'subscription_check' | 'device_connection' | 'device_command' | 'device_offline' | 'subscription_renewal';
export type LogStatus = 'success' | 'failed' | 'warning' | 'pending';
export type LogSeverity = 'info' | 'warning' | 'error';
export type NotificationStatus = 'delivered' | 'scheduled';
export type NotificationAudience = 'all' | 'inactive_subscriptions' | 'specific_users';
export type AlertType = 'warning' | 'error' | 'info';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  subscriptionStatus: SubscriptionStatus;
  assignedDevices: number;
  accountStatus: AccountStatus;
  createdAt: string;
  lastLogin: string;
  subscriptionExpiry: string | null;
}

export interface Device {
  id: string;
  name: string;
  firmwareVersion: string;
  assignedUser: string | null;
  assignedUserName: string | null;
  status: DeviceStatus;
  lastSeen: string;
  batteryLevel: number | null;
  model: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  duration: number;
  durationUnit: string;
  price: number;
  maxDevices: number;
  status: string;
  features: string[];
}

export interface Log {
  id: string;
  timestamp: string;
  userId: string | null;
  userName: string;
  deviceId: string | null;
  deviceName: string | null;
  action: LogAction;
  status: LogStatus;
  severity: LogSeverity;
  details: string;
  ipAddress: string | null;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  targetAudience: NotificationAudience;
  targetCount: number;
  sentAt?: string;
  scheduledFor?: string;
  status: NotificationStatus;
  readRate: number;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: string;
  is_active?: boolean;
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  avatar?: string | null;
}

export interface ModulePermissions {
  create?: boolean;
  read: boolean;
  update?: boolean;
  delete?: boolean;
  export?: boolean;
}

export interface RolePermission {
  label: string;
  description: string;
  permissions: {
    users: ModulePermissions;
    subscriptions: ModulePermissions;
    devices: ModulePermissions;
    logs: ModulePermissions;
    notifications: ModulePermissions;
    admins: ModulePermissions;
    settings: ModulePermissions;
  };
}

export interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  cancelledSubscriptions: number;
  inactiveSubscriptions: number;
  activeDevices: number;
  offlineDevices: number;
  logsToday: number;
  failedLoginAttempts: number;
  securityWarnings: number;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface UserGrowthData {
  month: string;
  users: number;
}

export interface DeviceUsageData {
  day: string;
  connections: number;
}

export interface DashboardAlert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: string;
  actionLabel: string;
  actionLink: string;
}

// Helper to generate dates
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const daysFromNow = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

// Users Mock Data
export const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'John Anderson',
    email: 'john.anderson@email.com',
    mobile: '+1 (555) 123-4567',
    subscriptionStatus: 'active',
    assignedDevices: 3,
    accountStatus: 'enabled',
    createdAt: daysAgo(120),
    lastLogin: daysAgo(1),
    subscriptionExpiry: daysFromNow(45),
  },
  {
    id: 'USR-002',
    name: 'Sarah Mitchell',
    email: 'sarah.m@company.com',
    mobile: '+1 (555) 234-5678',
    subscriptionStatus: 'active',
    assignedDevices: 2,
    accountStatus: 'enabled',
    createdAt: daysAgo(90),
    lastLogin: daysAgo(0),
    subscriptionExpiry: daysFromNow(5),
  },
  {
    id: 'USR-003',
    name: 'Michael Chen',
    email: 'mchen@techcorp.io',
    mobile: '+1 (555) 345-6789',
    subscriptionStatus: 'expired',
    assignedDevices: 1,
    accountStatus: 'enabled',
    createdAt: daysAgo(180),
    lastLogin: daysAgo(15),
    subscriptionExpiry: daysAgo(30),
  },
  {
    id: 'USR-004',
    name: 'Emily Rodriguez',
    email: 'emily.r@startup.co',
    mobile: '+1 (555) 456-7890',
    subscriptionStatus: 'cancelled',
    assignedDevices: 0,
    accountStatus: 'enabled',
    createdAt: daysAgo(200),
    lastLogin: daysAgo(45),
    subscriptionExpiry: daysAgo(20),
  },
  {
    id: 'USR-005',
    name: 'David Kim',
    email: 'dkim@enterprise.net',
    mobile: '+1 (555) 567-8901',
    subscriptionStatus: 'active',
    assignedDevices: 0,
    accountStatus: 'disabled',
    createdAt: daysAgo(150),
    lastLogin: daysAgo(30),
    subscriptionExpiry: daysFromNow(60),
  },
  {
    id: 'USR-006',
    name: 'Lisa Thompson',
    email: 'lisa.t@business.org',
    mobile: '+1 (555) 678-9012',
    subscriptionStatus: 'inactive',
    assignedDevices: 0,
    accountStatus: 'enabled',
    createdAt: daysAgo(60),
    lastLogin: daysAgo(7),
    subscriptionExpiry: null,
  },
];

// Role Permissions Configuration
export const rolePermissions: Record<AdminRole, RolePermission> = {
  owner: {
    label: 'Owner',
    description: 'Full system access',
    permissions: {
      users: { create: true, read: true, update: true, delete: true },
      subscriptions: { create: true, read: true, update: true, delete: true },
      devices: { create: true, read: true, update: true, delete: true },
      logs: { read: true, export: true },
      notifications: { create: true, read: true, update: true, delete: true },
      admins: { create: true, read: true, update: true, delete: true },
      settings: { read: true, update: true },
    },
  },
  admin: {
    label: 'Admin',
    description: 'Manage users, devices, and subscriptions',
    permissions: {
      users: { create: true, read: true, update: true, delete: false },
      subscriptions: { create: true, read: true, update: true, delete: false },
      devices: { create: true, read: true, update: true, delete: false },
      logs: { read: true, export: true },
      notifications: { create: true, read: true, update: false, delete: false },
      admins: { create: false, read: true, update: false, delete: false },
      settings: { read: true, update: false },
    },
  },
  support: {
    label: 'Support',
    description: 'Read-only access for support tasks',
    permissions: {
      users: { create: false, read: true, update: false, delete: false },
      subscriptions: { create: false, read: true, update: false, delete: false },
      devices: { create: false, read: true, update: false, delete: false },
      logs: { read: true, export: false },
      notifications: { create: false, read: true, update: false, delete: false },
      admins: { create: false, read: false, update: false, delete: false },
      settings: { read: false, update: false },
    },
  },
};

// Dashboard Stats
export const dashboardStats: DashboardStats = {
  totalUsers: 156,
  activeSubscriptions: 124,
  expiredSubscriptions: 18,
  cancelledSubscriptions: 8,
  inactiveSubscriptions: 6,
  activeDevices: 89,
  offlineDevices: 23,
  logsToday: 1247,
  failedLoginAttempts: 3,
  securityWarnings: 2,
};

// Chart Data
export const subscriptionChartData: ChartData[] = [
  { name: 'Active', value: 124, color: '#10B981' },
  { name: 'Expired', value: 18, color: '#EF4444' },
  { name: 'Cancelled', value: 8, color: '#F97316' },
  { name: 'Inactive', value: 6, color: '#6B7280' },
];

export const userGrowthData: UserGrowthData[] = [
  { month: 'Jan', users: 78 },
  { month: 'Feb', users: 92 },
  { month: 'Mar', users: 105 },
  { month: 'Apr', users: 118 },
  { month: 'May', users: 134 },
  { month: 'Jun', users: 148 },
  { month: 'Jul', users: 156 },
];

export const deviceUsageData: DeviceUsageData[] = [
  { day: 'Mon', connections: 234 },
  { day: 'Tue', connections: 287 },
  { day: 'Wed', connections: 312 },
  { day: 'Thu', connections: 298 },
  { day: 'Fri', connections: 276 },
  { day: 'Sat', connections: 189 },
  { day: 'Sun', connections: 156 },
];

// Alerts for Dashboard
export const dashboardAlerts: DashboardAlert[] = [
  {
    id: 'ALERT-001',
    type: 'warning',
    title: 'Inactive Subscriptions',
    message: '14 users have inactive subscriptions',
    timestamp: new Date().toISOString(),
    actionLabel: 'View Users',
    actionLink: '/users?filter=inactive',
  },
  {
    id: 'ALERT-002',
    type: 'error',
    title: 'Failed Login Attempts',
    message: '3 failed login attempts in the last 24 hours',
    timestamp: new Date().toISOString(),
    actionLabel: 'View Logs',
    actionLink: '/logs?filter=failed_login',
  },
  {
    id: 'ALERT-003',
    type: 'info',
    title: 'Devices Offline',
    message: '23 devices currently offline',
    timestamp: new Date().toISOString(),
    actionLabel: 'View Devices',
    actionLink: '/devices?filter=offline',
  },
];

// Current Admin (Logged in user)
export const currentAdmin: Admin = {
  id: 'ADM-001',
  name: 'Robert Hughes',
  email: 'robert.hughes@iotadmin.com',
  role: 'owner',
  status: 'active',
  lastLogin: daysAgo(0),
  createdAt: daysAgo(365),
  permissions: ['all'],
  avatar: null,
};
