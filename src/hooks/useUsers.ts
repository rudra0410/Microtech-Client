import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  forceLogoutUser,
  resetUserSubscription,
  clearError,
  setFilters,
  clearSelectedUser,
  setSelectedUser,
} from '../store/slices/userSlice';
import type { CreateUserData, UpdateUserData, UserFilters } from '../services/userService';
import type { User } from '../data/mock';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const {
    users,
    selectedUser,
    loading,
    error,
    filters,
    totalCount,
  } = useAppSelector((state) => state.users);

  // Actions
  const loadUsers = useCallback(
    (filters?: UserFilters) => {
      dispatch(fetchUsers(filters));
    },
    [dispatch]
  );

  const loadUserById = useCallback(
    (userId: string) => {
      dispatch(fetchUserById(userId));
    },
    [dispatch]
  );

  const createNewUser = useCallback(
    (userData: CreateUserData) => {
      return dispatch(createUser(userData));
    },
    [dispatch]
  );

  const updateUserData = useCallback(
    (userId: string, userData: UpdateUserData) => {
      return dispatch(updateUser({ userId, userData }));
    },
    [dispatch]
  );

  const toggleUserStatus = useCallback(
    (userId: string, isActive: boolean) => {
      return dispatch(updateUserStatus({ userId, isActive }));
    },
    [dispatch]
  );

  const removeUser = useCallback(
    (userId: string) => {
      return dispatch(deleteUser(userId));
    },
    [dispatch]
  );

  const forceUserLogout = useCallback(
    (userId: string) => {
      return dispatch(forceLogoutUser(userId));
    },
    [dispatch]
  );

  const resetSubscription = useCallback(
    (userId: string) => {
      return dispatch(resetUserSubscription(userId));
    },
    [dispatch]
  );

  const clearUserError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const updateFilters = useCallback(
    (newFilters: UserFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const clearSelected = useCallback(() => {
    dispatch(clearSelectedUser());
  }, [dispatch]);

  const selectUser = useCallback(
    (user: User) => {
      dispatch(setSelectedUser(user));
    },
    [dispatch]
  );

  return {
    // State
    users,
    selectedUser,
    loading,
    error,
    filters,
    totalCount,
    
    // Actions
    loadUsers,
    loadUserById,
    createNewUser,
    updateUserData,
    toggleUserStatus,
    removeUser,
    forceUserLogout,
    resetSubscription,
    clearUserError,
    updateFilters,
    clearSelected,
    selectUser,
  };
};