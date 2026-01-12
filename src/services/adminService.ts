/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiClient } from '../lib/api';
import type { Admin } from '../data/mock';
import { AxiosError } from 'axios';

export const adminService = {
  // Validate admin login (called before Firebase auth)
  async validateLogin(email: string): Promise<Admin> {
    try {
      const response = await apiClient.post('/api/admin/validate-login', { email });
      return response.data.data; // Assuming your API returns { success: true, data: admin, message: string }
    } catch (error) {
      console.error('Error validating admin login:', error);
      throw error;
    }
  },

  // Get admin profile (requires authentication)
  async getAdminProfile(): Promise<Admin> {
    try {
      const response = await apiClient.get('/api/admin/profile');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      throw error;
    }
  },

  // Get admin by Firebase UID (requires authentication)
  async getAdminById(_firebaseUid: string): Promise<Admin | null> {
    try {
      // Use the profile endpoint since it gets admin by Firebase UID from token
      const response = await apiClient.get('/api/admin/profile');
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error fetching admin by ID:', error);
      // Check if it's an Axios error
      if (error instanceof AxiosError) {
        if (error.response?.status === 404 || error.response?.status === 403) {
          return null;
        }
      }
      throw error;
    }
  },

  // Get all users/admins (requires admin authentication)
  async getAllAdmins(): Promise<Admin[]> {
    try {
      const response = await apiClient.post('/api/admin/users/list', {});
      return response.data.data;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  },

  // Create new user/admin (requires admin authentication)
  async createAdmin(adminData: Omit<Admin, 'id' | 'createdAt' | 'lastLogin'>): Promise<Admin> {
    try {
      const response = await apiClient.post('/api/admin/users', adminData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating admin:', error);
      
      // Handle Firebase auth errors specifically
      if (error instanceof AxiosError && error.response?.data?.error) {
        const firebaseError = {
          errorInfo: {
            code: error.response.data.error.code,
            message: error.response.data.error.message
          },
          codePrefix: error.response.data.error.codePrefix
        };
        throw firebaseError;
      }
      
      throw error;
    }
  },

  // Update admin profile (requires admin authentication)
  async updateAdmin(id: string, updates: Partial<Admin>): Promise<void> {
    try {
      await apiClient.patch(`/api/admin/users/${id}`, updates);
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  },

  // Update admin status (requires admin authentication)
  async updateAdminStatus(id: string, isActive: boolean): Promise<void> {
    try {
      await apiClient.patch(`/api/admin/users/${id}/status`, { is_active: isActive });
    } catch (error) {
      console.error('Error updating admin status:', error);
      throw error;
    }
  },

  // Delete admin (requires admin authentication)
  async deleteAdmin(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/admin/users/${id}`);
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  },

  // Refresh token validation
  async validateTokenRefresh(): Promise<{ success: boolean; expiresAt: number; uid: string }> {
    try {
      const response = await apiClient.post('/api/admin/validate-token-refresh');
      return response.data;
    } catch (error) {
      console.error('Error validating token refresh:', error);
      throw error;
    }
  },

  // Update last login (handled automatically by backend)
  async updateLastLogin(id: string): Promise<void> {
    console.log('Last login updated for user:', id);
    // This is handled automatically by the admin middleware
  }
};