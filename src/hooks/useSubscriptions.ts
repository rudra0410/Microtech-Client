import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchAllSubscriptions,
  fetchSubscriptionById,
  assignSubscription,
  updateSubscription,
  extendSubscription,
  expireSubscription,
  deleteSubscription,
  fetchUserSubscriptions,
  fetchUserActiveSubscription,
  clearError,
  clearSelectedSubscription,
  setSelectedSubscription,
} from '../store/slices/subscriptionSlice';
import type { Subscription, SubscriptionWithUser } from '../services/subscriptionService';

export const useSubscriptions = () => {
  const dispatch = useAppDispatch();
  const {
    subscriptions,
    selectedSubscription,
    userSubscriptions,
    userActiveSubscriptions,
    loading,
    error,
    totalCount,
  } = useAppSelector((state) => state.subscriptions);

  // Actions
  const loadAllSubscriptions = useCallback(() => {
    dispatch(fetchAllSubscriptions());
  }, [dispatch]);

  const loadSubscriptionById = useCallback(
    (userId: string) => {
      dispatch(fetchSubscriptionById(userId));
    },
    [dispatch]
  );

  const createSubscription = useCallback(
    (userId: string, startDate: string, endDate: string) => {
      return dispatch(assignSubscription({ userId, startDate, endDate }));
    },
    [dispatch]
  );

  const updateSubscriptionData = useCallback(
    (subscriptionId: string, updateData: Partial<Subscription>) => {
      return dispatch(updateSubscription({ subscriptionId, updateData }));
    },
    [dispatch]
  );

  const extendUserSubscription = useCallback(
    (userId: string, newEndDate: string) => {
      return dispatch(extendSubscription({ userId, newEndDate }));
    },
    [dispatch]
  );

  const expireUserSubscription = useCallback(
    (userId: string) => {
      return dispatch(expireSubscription(userId));
    },
    [dispatch]
  );

  const removeSubscription = useCallback(
    (subscriptionId: string) => {
      return dispatch(deleteSubscription(subscriptionId));
    },
    [dispatch]
  );

  const loadUserSubscriptions = useCallback(
    (userId: string) => {
      dispatch(fetchUserSubscriptions(userId));
    },
    [dispatch]
  );

  const loadUserActiveSubscription = useCallback(
    (userId: string) => {
      dispatch(fetchUserActiveSubscription(userId));
    },
    [dispatch]
  );

  const clearSubscriptionError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearSelected = useCallback(() => {
    dispatch(clearSelectedSubscription());
  }, [dispatch]);

  const selectSubscription = useCallback(
    (subscription: SubscriptionWithUser) => {
      dispatch(setSelectedSubscription(subscription));
    },
    [dispatch]
  );

  // Helper functions
  const getUserSubscriptions = useCallback(
    (userId: string) => {
      return userSubscriptions[userId] || [];
    },
    [userSubscriptions]
  );

  const getUserActiveSubscription = useCallback(
    (userId: string) => {
      return userActiveSubscriptions[userId] || null;
    },
    [userActiveSubscriptions]
  );

  const getSubscriptionsByStatus = useCallback(
    (status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED') => {
      return subscriptions.filter(sub => sub.status === status);
    },
    [subscriptions]
  );

  return {
    // State
    subscriptions,
    selectedSubscription,
    userSubscriptions,
    userActiveSubscriptions,
    loading,
    error,
    totalCount,
    
    // Actions
    loadAllSubscriptions,
    loadSubscriptionById,
    createSubscription,
    updateSubscriptionData,
    extendUserSubscription,
    expireUserSubscription,
    removeSubscription,
    loadUserSubscriptions,
    loadUserActiveSubscription,
    clearSubscriptionError,
    clearSelected,
    selectSubscription,
    
    // Helpers
    getUserSubscriptions,
    getUserActiveSubscription,
    getSubscriptionsByStatus,
  };
};