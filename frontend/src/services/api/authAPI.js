import apiClient from './apiClient';

const authAPI = {
  // Authentication
  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },

  login: (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  logout: (data) => {
    return apiClient.post('/auth/logout', data);
  },

  logoutAll: () => {
    return apiClient.post('/auth/logout-all');
  },

  refreshToken: (data) => {
    return apiClient.post('/auth/refresh-token', data);
  },

  // Profile Management
  getProfile: () => {
    return apiClient.get('/auth/me');
  },

  updateProfile: (profileData) => {
    return apiClient.put('/auth/me', profileData);
  },

  changePassword: (passwordData) => {
    return apiClient.post('/auth/change-password', passwordData);
  },

  // Password Reset
  forgotPassword: (data) => {
    return apiClient.post('/auth/forgot-password', data);
  },

  resetPassword: (data) => {
    return apiClient.post('/auth/reset-password', data);
  },

  // Email Verification
  verifyEmail: (token) => {
    return apiClient.post(`/auth/verify-email/${token}`);
  },

  resendVerification: (data) => {
    return apiClient.post('/auth/resend-verification', data);
  },

  // Two-Factor Authentication
  setup2FA: () => {
    return apiClient.post('/auth/2fa/setup');
  },

  verify2FA: (data) => {
    return apiClient.post('/auth/2fa/verify', data);
  },

  disable2FA: (data) => {
    return apiClient.post('/auth/2fa/disable', data);
  },

  getBackupCodes: () => {
    return apiClient.get('/auth/2fa/backup-codes');
  },

  regenerateBackupCodes: () => {
    return apiClient.post('/auth/2fa/regenerate-backup-codes');
  },

  // Session Management
  getSessions: () => {
    return apiClient.get('/auth/sessions');
  },

  revokeSession: (sessionId) => {
    return apiClient.delete(`/auth/sessions/${sessionId}`);
  },

  // Account Management
  deleteAccount: (data) => {
    return apiClient.delete('/auth/account', { data });
  },
};

export default authAPI;
