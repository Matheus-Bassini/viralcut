import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from '../../services/api/authAPI';
import { setTokens, removeTokens, getStoredTokens } from '../../utils/auth';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  tokens: null,
  requiresTwoFactor: false,
  isEmailVerified: false,
};

// Async thunks
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const tokens = getStoredTokens();
      if (!tokens?.accessToken) {
        return { user: null, tokens: null };
      }

      // Verify token and get user profile
      const response = await authAPI.getProfile();
      return {
        user: response.data.user,
        tokens,
      };
    } catch (error) {
      // Token is invalid, clear stored tokens
      removeTokens();
      return rejectWithValue(error.response?.data?.message || 'Authentication failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, twoFactorToken, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login({
        email,
        password,
        twoFactorToken,
        rememberMe,
      });

      if (response.data.requiresTwoFactor) {
        return {
          requiresTwoFactor: true,
          email,
        };
      }

      const { user, accessToken, refreshToken } = response.data.data;
      const tokens = { accessToken, refreshToken };
      
      setTokens(tokens);
      
      return {
        user,
        tokens,
        requiresTwoFactor: false,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { tokens } = getState().auth;
      if (tokens?.refreshToken) {
        await authAPI.logout({ refreshToken: tokens.refreshToken });
      }
      removeTokens();
      return {};
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      removeTokens();
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { tokens } = getState().auth;
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authAPI.refreshToken({
        refreshToken: tokens.refreshToken,
      });

      const newTokens = {
        accessToken: response.data.data.accessToken,
        refreshToken: tokens.refreshToken, // Keep existing refresh token
      };

      setTokens(newTokens);
      
      return { tokens: newTokens };
    } catch (error) {
      removeTokens();
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authAPI.changePassword({
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password change failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await authAPI.forgotPassword({ email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password reset request failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.resetPassword({ token, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyEmail(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Email verification failed');
    }
  }
);

export const resendVerification = createAsyncThunk(
  'auth/resendVerification',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await authAPI.resendVerification({ email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resend verification email');
    }
  }
);

export const setup2FA = createAsyncThunk(
  'auth/setup2FA',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.setup2FA();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '2FA setup failed');
    }
  }
);

export const verify2FA = createAsyncThunk(
  'auth/verify2FA',
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verify2FA({ token });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '2FA verification failed');
    }
  }
);

export const disable2FA = createAsyncThunk(
  'auth/disable2FA',
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await authAPI.disable2FA({ token });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '2FA disable failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRequiresTwoFactor: (state) => {
      state.requiresTwoFactor = false;
    },
    updateUserData: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setEmailVerified: (state, action) => {
      state.isEmailVerified = action.payload;
      if (state.user) {
        state.user.isEmailVerified = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize Auth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = !!action.payload.user;
        state.isEmailVerified = action.payload.user?.isEmailVerified || false;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.requiresTwoFactor) {
          state.requiresTwoFactor = true;
          state.error = null;
        } else {
          state.user = action.payload.user;
          state.tokens = action.payload.tokens;
          state.isAuthenticated = true;
          state.requiresTwoFactor = false;
          state.isEmailVerified = action.payload.user?.isEmailVerified || false;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.requiresTwoFactor = false;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        state.requiresTwoFactor = false;
        state.isEmailVerified = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        // Still clear auth state even if logout request failed
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        state.requiresTwoFactor = false;
        state.isEmailVerified = false;
        state.error = action.payload;
      })

      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.tokens = action.payload.tokens;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        state.requiresTwoFactor = false;
        state.isEmailVerified = false;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        // Password changed successfully, user needs to login again
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        state.requiresTwoFactor = false;
        state.isEmailVerified = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.isEmailVerified = true;
        if (state.user) {
          state.user.isEmailVerified = true;
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Resend Verification
      .addCase(resendVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 2FA Setup
      .addCase(setup2FA.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setup2FA.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(setup2FA.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 2FA Verify
      .addCase(verify2FA.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verify2FA.fulfilled, (state) => {
        state.isLoading = false;
        if (state.user) {
          state.user.twoFactorEnabled = true;
        }
      })
      .addCase(verify2FA.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 2FA Disable
      .addCase(disable2FA.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(disable2FA.fulfilled, (state) => {
        state.isLoading = false;
        if (state.user) {
          state.user.twoFactorEnabled = false;
        }
      })
      .addCase(disable2FA.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearRequiresTwoFactor,
  updateUserData,
  setEmailVerified,
} = authSlice.actions;

export default authSlice.reducer;
