import axios from 'axios';
import { store } from '../../store';
import { refreshToken, logout } from '../../store/slices/authSlice';
import { getStoredTokens, setTokens, removeTokens } from '../../utils/auth';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const tokens = getStoredTokens();
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = getStoredTokens();
        if (tokens?.refreshToken) {
          // Attempt to refresh the token
          const response = await axios.post(
            `${apiClient.defaults.baseURL}/auth/refresh-token`,
            { refreshToken: tokens.refreshToken }
          );

          const { accessToken } = response.data.data;
          const newTokens = {
            accessToken,
            refreshToken: tokens.refreshToken,
          };

          // Update stored tokens
          setTokens(newTokens);

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        removeTokens();
        store.dispatch(logout());
        
        // Redirect to login if we're not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Handle other error cases
    if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Access forbidden:', error.response.data);
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

// Request/Response logging in development
if (import.meta.env.DEV) {
  apiClient.interceptors.request.use(
    (config) => {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
      return config;
    }
  );

  apiClient.interceptors.response.use(
    (response) => {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return Promise.reject(error);
    }
  );
}

export default apiClient;
