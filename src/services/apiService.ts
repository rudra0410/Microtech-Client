import { apiClient } from '../lib/api';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export const apiService = {
  // Health check
  async healthCheck(): Promise<string> {
    try {
      const response = await apiClient.get('/');
      // Handle both string and object responses from server
      if (typeof response.data === 'string') {
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        // If server returns an object, extract the message or create a status message
        return response.data.message || `Server is running (${response.data.success ? 'OK' : 'Error'})`;
      } else {
        return 'Server is running';
      }
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Generic GET request
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  },

  // Generic POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  },

  // Generic PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  },

  // Generic PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await apiClient.patch(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`PATCH ${endpoint} failed:`, error);
      throw error;
    }
  },

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await apiClient.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }
};