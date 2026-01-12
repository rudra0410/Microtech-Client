/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Token refresh flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Force token refresh if it's close to expiry
        const token = await user.getIdToken(false); // false = don't force refresh initially
        const tokenResult = await user.getIdTokenResult();
        
        // Check if token expires within next 5 minutes
        const expirationTime = new Date(tokenResult.expirationTime).getTime();
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;
        
        if (timeUntilExpiry < 5 * 60 * 1000) { // 5 minutes in milliseconds
          console.log('Token expiring soon, refreshing...');
          const refreshedToken = await user.getIdToken(true); // true = force refresh
          config.headers.Authorization = `Bearer ${refreshedToken}`;
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
      // Don't throw here, let the request proceed without token
      // The server will handle the missing token appropriately
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Check if server suggests token refresh
    const refreshSuggested = response.headers['x-token-refresh-suggested'];
    if (refreshSuggested === 'true') {
      console.log('Server suggests token refresh');
      // Optionally trigger background token refresh
      const user = auth.currentUser;
      if (user) {
        user.getIdToken(true).catch(console.error);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const user = auth.currentUser;
        if (user) {
          console.log('Attempting to refresh token due to 401 error');
          const newToken = await user.getIdToken(true); // Force refresh
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Process queued requests
          processQueue(null, newToken);
          
          // Retry the original request
          return apiClient(originalRequest);
        } else {
          throw new Error('No authenticated user found');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        
        // Redirect to login or handle authentication failure
        if (typeof window !== 'undefined') {
          // Clear any stored auth state
          localStorage.removeItem('authToken');
          // Redirect to login page
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error cases
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.status);
    }

    return Promise.reject(error);
  }
);

export default apiClient;