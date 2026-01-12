import { apiClient } from '../lib/api';
import type { User } from '../data/mock';

export interface CreateUserData {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  mobile?: string;
}

export interface UserFilters {
  subscriptionStatus?: 'active' | 'expired' | 'cancelled' | 'inactive';
  accountStatus?: 'enabled' | 'disabled';
  role?: string;
  is_active?: boolean;
}

export const userService = {
  // Helper function to extract numeric ID from USR-XXX format
  extractNumericId(userId: string): string {
    return userId.startsWith('USR-') ? userId.replace('USR-', '') : userId;
  },

  // Get all users with optional filters
  async getUsers(filters?: UserFilters): Promise<User[]> {
    try {
      const requestBody: Record<string, unknown> = {};
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            requestBody[key] = value;
          }
        });
      }
      console.log('Request Body:', requestBody);
      console.log("getAllUsers req sent");
      const response = await apiClient.post('/api/admin/users/getAllUsers', requestBody);
      console.log("response", response);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(userId: string): Promise<User> {
    try {
      const response = await apiClient.post('/api/admin/users/getUserDetails', {
        userId: this.extractNumericId(userId)
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await apiClient.post('/api/admin/users/createNewUser', {
        username: userData.name,
        email: userData.email,
        phone: userData.mobile,
        password: userData.password,
        role: 'USER'
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(userId: string, userData: UpdateUserData): Promise<User> {
    try {
      const updatePayload: Record<string, string> = {
        userId: this.extractNumericId(userId)
      };
      if (userData.name) updatePayload.username = userData.name;
      if (userData.email) updatePayload.email = userData.email;
      if (userData.mobile) updatePayload.phone = userData.mobile;

      const response = await apiClient.post('/api/admin/users/updateUserProfile', updatePayload);
      return response.data.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Update user status (enable/disable)
  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    try {
      const response = await apiClient.post('/api/admin/users/updateUserStatus', {
        userId: this.extractNumericId(userId),
        is_active: isActive
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  // Delete user (soft delete)
  async deleteUser(userId: string): Promise<void> {
    try {
      await apiClient.post('/api/admin/users/deleteUser', {
        userId: this.extractNumericId(userId)
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Force logout user from all sessions
  async forceLogoutUser(userId: string): Promise<void> {
    try {
      await apiClient.post('/api/admin/users/forceLogoutUser', {
        userId: this.extractNumericId(userId)
      });
    } catch (error) {
      console.error('Error forcing user logout:', error);
      throw error;
    }
  },

  // Reset user subscription
  async resetUserSubscription(userId: string): Promise<User> {
    try {
      const response = await apiClient.post('/api/admin/users/resetUserSubscription', {
        userId: this.extractNumericId(userId)
      });
      return response.data.data;
    } catch (error) {
      console.error('Error resetting user subscription:', error);
      throw error;
    }
  }
};