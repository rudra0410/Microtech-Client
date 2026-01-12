import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchDashboardStats,
  fetchSubscriptionChartData,
  fetchUserGrowthData,
  fetchMonthlyUsersData,
  fetchDeviceUsageData,
  fetchDashboardAlerts,
  fetchAllDashboardData,
  clearError,
  refreshData,
} from '../store/slices/dashboardSlice';

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const {
    stats,
    subscriptionChart,
    userGrowth,
    monthlyUsers,
    deviceUsage,
    alerts,
    loading,
    error,
    lastUpdated,
  } = useAppSelector((state) => state.dashboard);

  // Actions
  const loadDashboardStats = useCallback(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const loadSubscriptionChart = useCallback(() => {
    dispatch(fetchSubscriptionChartData());
  }, [dispatch]);

  const loadUserGrowth = useCallback(() => {
    dispatch(fetchUserGrowthData());
  }, [dispatch]);

  const loadMonthlyUsers = useCallback(() => {
    dispatch(fetchMonthlyUsersData());
  }, [dispatch]);

  const loadDeviceUsage = useCallback(() => {
    dispatch(fetchDeviceUsageData());
  }, [dispatch]);

  const loadAlerts = useCallback(() => {
    dispatch(fetchDashboardAlerts());
  }, [dispatch]);

  const loadAllData = useCallback(() => {
    dispatch(fetchAllDashboardData());
  }, [dispatch]);

  const clearDashboardError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const refresh = useCallback(() => {
    dispatch(refreshData());
    dispatch(fetchAllDashboardData());
  }, [dispatch]);

  // Computed values
  const isLoading = Object.values(loading).some(Boolean);
  const hasData = stats !== null;

  return {
    // State
    stats,
    subscriptionChart,
    userGrowth,
    monthlyUsers,
    deviceUsage,
    alerts,
    loading,
    error,
    lastUpdated,
    isLoading,
    hasData,
    
    // Actions
    loadDashboardStats,
    loadSubscriptionChart,
    loadUserGrowth,
    loadMonthlyUsers,
    loadDeviceUsage,
    loadAlerts,
    loadAllData,
    clearDashboardError,
    refresh,
  };
};