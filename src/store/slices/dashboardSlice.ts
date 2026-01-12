import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  dashboardService, 
  DashboardStats, 
  ChartData, 
  UserGrowthData, 
  MonthlyUsersData,
  DeviceUsageData, 
  DashboardAlert
} from '../../services/dashboardService';

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async () => {
    const response = await dashboardService.getDashboardStats();
    return response;
  }
);

export const fetchSubscriptionChartData = createAsyncThunk(
  'dashboard/fetchSubscriptionChart',
  async () => {
    const response = await dashboardService.getSubscriptionChartData();
    return response;
  }
);

export const fetchUserGrowthData = createAsyncThunk(
  'dashboard/fetchUserGrowth',
  async () => {
    const response = await dashboardService.getUserGrowthData();
    return response;
  }
);

export const fetchMonthlyUsersData = createAsyncThunk(
  'dashboard/fetchMonthlyUsers',
  async () => {
    const response = await dashboardService.getMonthlyUsersData();
    return response;
  }
);

export const fetchDeviceUsageData = createAsyncThunk(
  'dashboard/fetchDeviceUsage',
  async () => {
    const response = await dashboardService.getDeviceUsageData();
    return response;
  }
);

export const fetchDashboardAlerts = createAsyncThunk(
  'dashboard/fetchAlerts',
  async () => {
    const response = await dashboardService.getDashboardAlerts();
    return response;
  }
);

export const fetchAllDashboardData = createAsyncThunk(
  'dashboard/fetchAllData',
  async () => {
    const response = await dashboardService.getAllDashboardData();
    return response;
  }
);

// State interface
interface DashboardState {
  stats: DashboardStats | null;
  subscriptionChart: ChartData[];
  userGrowth: UserGrowthData[];
  monthlyUsers: MonthlyUsersData[];
  deviceUsage: DeviceUsageData[];
  alerts: DashboardAlert[];
  loading: {
    stats: boolean;
    subscriptionChart: boolean;
    userGrowth: boolean;
    monthlyUsers: boolean;
    deviceUsage: boolean;
    alerts: boolean;
    all: boolean;
  };
  error: string | null;
  lastUpdated: string | null;
}

// Initial state
const initialState: DashboardState = {
  stats: null,
  subscriptionChart: [],
  userGrowth: [],
  monthlyUsers: [],
  deviceUsage: [],
  alerts: [],
  loading: {
    stats: false,
    subscriptionChart: false,
    userGrowth: false,
    monthlyUsers: false,
    deviceUsage: false,
    alerts: false,
    all: false,
  },
  error: null,
  lastUpdated: null,
};

// Slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    refreshData: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    // Fetch dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.error.message || 'Failed to fetch dashboard stats';
      });

    // Fetch subscription chart data
    builder
      .addCase(fetchSubscriptionChartData.pending, (state) => {
        state.loading.subscriptionChart = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionChartData.fulfilled, (state, action) => {
        state.loading.subscriptionChart = false;
        state.subscriptionChart = action.payload;
      })
      .addCase(fetchSubscriptionChartData.rejected, (state, action) => {
        state.loading.subscriptionChart = false;
        state.error = action.error.message || 'Failed to fetch subscription chart data';
      });

    // Fetch user growth data
    builder
      .addCase(fetchUserGrowthData.pending, (state) => {
        state.loading.userGrowth = true;
        state.error = null;
      })
      .addCase(fetchUserGrowthData.fulfilled, (state, action) => {
        state.loading.userGrowth = false;
        state.userGrowth = action.payload;
      })
      .addCase(fetchUserGrowthData.rejected, (state, action) => {
        state.loading.userGrowth = false;
        state.error = action.error.message || 'Failed to fetch user growth data';
      });

    // Fetch monthly users data
    builder
      .addCase(fetchMonthlyUsersData.pending, (state) => {
        state.loading.monthlyUsers = true;
        state.error = null;
      })
      .addCase(fetchMonthlyUsersData.fulfilled, (state, action) => {
        state.loading.monthlyUsers = false;
        state.monthlyUsers = action.payload;
      })
      .addCase(fetchMonthlyUsersData.rejected, (state, action) => {
        state.loading.monthlyUsers = false;
        state.error = action.error.message || 'Failed to fetch monthly users data';
      });

    // Fetch device usage data
    builder
      .addCase(fetchDeviceUsageData.pending, (state) => {
        state.loading.deviceUsage = true;
        state.error = null;
      })
      .addCase(fetchDeviceUsageData.fulfilled, (state, action) => {
        state.loading.deviceUsage = false;
        state.deviceUsage = action.payload;
      })
      .addCase(fetchDeviceUsageData.rejected, (state, action) => {
        state.loading.deviceUsage = false;
        state.error = action.error.message || 'Failed to fetch device usage data';
      });

    // Fetch dashboard alerts
    builder
      .addCase(fetchDashboardAlerts.pending, (state) => {
        state.loading.alerts = true;
        state.error = null;
      })
      .addCase(fetchDashboardAlerts.fulfilled, (state, action) => {
        state.loading.alerts = false;
        state.alerts = action.payload;
      })
      .addCase(fetchDashboardAlerts.rejected, (state, action) => {
        state.loading.alerts = false;
        state.error = action.error.message || 'Failed to fetch dashboard alerts';
      });

    // Fetch all dashboard data
    builder
      .addCase(fetchAllDashboardData.pending, (state) => {
        state.loading.all = true;
        state.error = null;
      })
      .addCase(fetchAllDashboardData.fulfilled, (state, action) => {
        state.loading.all = false;
        state.stats = action.payload.stats;
        state.subscriptionChart = action.payload.subscriptionChart;
        state.userGrowth = action.payload.userGrowth;
        state.monthlyUsers = action.payload.monthlyUsers;
        state.deviceUsage = action.payload.deviceUsage;
        state.alerts = action.payload.alerts;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAllDashboardData.rejected, (state, action) => {
        state.loading.all = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      });
  },
});

export const { clearError, refreshData } = dashboardSlice.actions;
export default dashboardSlice.reducer;