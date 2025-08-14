import Cookies from 'js-cookie';

const TOKEN_KEY = 'viralcut_tokens';
const REFRESH_TOKEN_KEY = 'viralcut_refresh_token';

// Token storage utilities
export const setTokens = (tokens) => {
  if (tokens.accessToken) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    
    // Also store refresh token in httpOnly cookie for better security
    if (tokens.refreshToken) {
      Cookies.set(REFRESH_TOKEN_KEY, tokens.refreshToken, {
        expires: 30, // 30 days
        secure: import.meta.env.PROD,
        sameSite: 'strict'
      });
    }
  }
};

export const getStoredTokens = () => {
  try {
    const storedTokens = localStorage.getItem(TOKEN_KEY);
    if (storedTokens) {
      const tokens = JSON.parse(storedTokens);
      
      // Get refresh token from cookie if not in localStorage
      if (!tokens.refreshToken) {
        tokens.refreshToken = Cookies.get(REFRESH_TOKEN_KEY);
      }
      
      return tokens;
    }
    
    // Fallback: check if refresh token exists in cookie
    const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      return { refreshToken };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting stored tokens:', error);
    return null;
  }
};

export const removeTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};

export const getAccessToken = () => {
  const tokens = getStoredTokens();
  return tokens?.accessToken || null;
};

export const getRefreshToken = () => {
  const tokens = getStoredTokens();
  return tokens?.refreshToken || null;
};

// Token validation utilities
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const getTokenPayload = (token) => {
  if (!token) return null;
  
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Error parsing token payload:', error);
    return null;
  }
};

export const isAccessTokenValid = () => {
  const accessToken = getAccessToken();
  return accessToken && !isTokenExpired(accessToken);
};

// User role and permission utilities
export const getUserRole = () => {
  const accessToken = getAccessToken();
  if (!accessToken) return null;
  
  const payload = getTokenPayload(accessToken);
  return payload?.role || null;
};

export const getUserSubscriptionPlan = () => {
  const accessToken = getAccessToken();
  if (!accessToken) return 'free';
  
  const payload = getTokenPayload(accessToken);
  return payload?.subscriptionPlan || 'free';
};

export const hasPermission = (requiredPlan) => {
  const userPlan = getUserSubscriptionPlan();
  
  const planHierarchy = {
    free: 0,
    pro: 1,
    business: 2,
    sacred: 3
  };
  
  const userLevel = planHierarchy[userPlan] || 0;
  const requiredLevel = planHierarchy[requiredPlan] || 0;
  
  return userLevel >= requiredLevel;
};

// Session management
export const isLoggedIn = () => {
  const tokens = getStoredTokens();
  return !!(tokens?.accessToken || tokens?.refreshToken);
};

export const shouldRefreshToken = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  // If no refresh token, can't refresh
  if (!refreshToken) return false;
  
  // If no access token, should refresh
  if (!accessToken) return true;
  
  // If access token is expired, should refresh
  return isTokenExpired(accessToken);
};

// Security utilities
export const generateDeviceFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Device fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  return btoa(fingerprint).slice(0, 32);
};

export const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    fingerprint: generateDeviceFingerprint()
  };
};

// Password strength validation
export const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const score = [
    password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar
  ].filter(Boolean).length;
  
  let strength = 'weak';
  if (score >= 4) strength = 'strong';
  else if (score >= 3) strength = 'medium';
  
  return {
    score,
    strength,
    isValid: score >= 4,
    requirements: {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    }
  };
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Two-factor authentication utilities
export const formatTwoFactorCode = (code) => {
  // Remove any non-numeric characters and limit to 6 digits
  return code.replace(/\D/g, '').slice(0, 6);
};

export const isTwoFactorCodeValid = (code) => {
  return /^\d{6}$/.test(code);
};

// Logout utility
export const performLogout = () => {
  removeTokens();
  
  // Clear any other stored user data
  localStorage.removeItem('user_preferences');
  localStorage.removeItem('video_drafts');
  
  // Clear Redux store will be handled by the logout action
  
  // Redirect to login page
  window.location.href = '/login';
};

export default {
  setTokens,
  getStoredTokens,
  removeTokens,
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  getTokenPayload,
  isAccessTokenValid,
  getUserRole,
  getUserSubscriptionPlan,
  hasPermission,
  isLoggedIn,
  shouldRefreshToken,
  generateDeviceFingerprint,
  getDeviceInfo,
  validatePasswordStrength,
  validateEmail,
  formatTwoFactorCode,
  isTwoFactorCodeValid,
  performLogout
};
