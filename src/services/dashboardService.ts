import { apiClient } from "../lib/api";

export interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  expiringSubscriptions: number;
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

export interface MonthlyUsersData {
  month: string;
  newUsers: number;
}

export interface DeviceUsageData {
  day: string;
  connections: number;
}

export interface DashboardAlert {
  id: string;
  type: "warning" | "error" | "info";
  title: string;
  message: string;
  timestamp: string;
  actionLabel: string;
  actionLink: string;
}

export interface AllDashboardData {
  stats: DashboardStats;
  subscriptionChart: ChartData[];
  userGrowth: UserGrowthData[];
  monthlyUsers: MonthlyUsersData[];
  deviceUsage: DeviceUsageData[];
  alerts: DashboardAlert[];
}

class DashboardService {
  private baseUrl = "/api/admin/dashboard";

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.post(`${this.baseUrl}/stats`);
    return response.data.data;
  }

  async getSubscriptionChartData(): Promise<ChartData[]> {
    const response = await apiClient.post(`${this.baseUrl}/subscription-chart`);
    return response.data.data;
  }

  async getUserGrowthData(): Promise<UserGrowthData[]> {
    const response = await apiClient.post(`${this.baseUrl}/user-growth`);
    return response.data.data;
  }

  async getMonthlyUsersData(): Promise<MonthlyUsersData[]> {
    const response = await apiClient.post(`${this.baseUrl}/monthly-users`);
    return response.data.data;
  }

  async getDeviceUsageData(): Promise<DeviceUsageData[]> {
    const response = await apiClient.post(`${this.baseUrl}/device-usage`);
    return response.data.data;
  }

  async getDashboardAlerts(): Promise<DashboardAlert[]> {
    const response = await apiClient.post(`${this.baseUrl}/alerts`);
    return response.data.data;
  }

  async getAllDashboardData(): Promise<AllDashboardData> {
    const response = await apiClient.post(`${this.baseUrl}/all`);
    return response.data.data;
  }
}

export const dashboardService = new DashboardService();
