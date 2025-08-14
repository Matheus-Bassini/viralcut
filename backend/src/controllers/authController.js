const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { User } = require('../models');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

class AuthController {
  // Register new user
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password, firstName, lastName, language = 'pt-BR' } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create new user
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        language,
        emailVerificationToken,
        emailVerificationExpires
      });

      // Send verification email
      await emailService.sendVerificationEmail(user, emailVerificationToken);

      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email to verify your account.',
        data: {
          userId: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during registration'
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password, twoFactorToken, rememberMe = false } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to too many failed login attempts'
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        await user.incLoginAttempts();
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check 2FA if enabled
      if (user.twoFactorEnabled) {
        if (!twoFactorToken) {
          return res.status(200).json({
            success: true,
            requiresTwoFactor: true,
            message: 'Two-factor authentication required'
          });
        }

        const isValidToken = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: 'base32',
          token: twoFactorToken,
          window: 2
        });

        if (!isValidToken) {
          // Check backup codes
          const backupCode = user.twoFactorBackupCodes.find(
            code => code.code === twoFactorToken && !code.used
          );

          if (!backupCode) {
            await user.incLoginAttempts();
            return res.status(401).json({
              success: false,
              message: 'Invalid two-factor authentication token'
            });
          }

          // Mark backup code as used
          backupCode.used = true;
          await user.save();
        }
      }

      // Reset login attempts on successful login
      if (user.loginAttempts > 0) {
        await user.resetLoginAttempts();
      }

      // Update last login
      user.lastLogin = new Date();
      user.lastActiveAt = new Date();
      await user.save();

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Store refresh token
      const deviceInfo = req.get('User-Agent') || 'Unknown device';
      const refreshTokenExpiry = new Date(Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000);
      
      user.refreshTokens.push({
        token: refreshToken,
        expiresAt: refreshTokenExpiry,
        deviceInfo
      });

      // Keep only last 5 refresh tokens
      if (user.refreshTokens.length > 5) {
        user.refreshTokens = user.refreshTokens.slice(-5);
      }

      await user.save();

      logger.info(`User logged in: ${email}`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            subscriptionPlan: user.subscriptionPlan,
            subscriptionStatus: user.subscriptionStatus,
            language: user.language,
            isEmailVerified: user.isEmailVerified,
            twoFactorEnabled: user.twoFactorEnabled
          },
          accessToken,
          refreshToken,
          expiresIn: '15m'
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login'
      });
    }
  }

  // Logout user
  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      const user = req.user;

      if (refreshToken) {
        // Remove specific refresh token
        user.refreshTokens = user.refreshTokens.filter(
          token => token.token !== refreshToken
        );
        await user.save();
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during logout'
      });
    }
  }

  // Logout from all devices
  async logoutAll(req, res) {
    try {
      const user = req.user;
      user.refreshTokens = [];
      await user.save();

      res.json({
        success: true,
        message: 'Logged out from all devices successfully'
      });
    } catch (error) {
      logger.error('Logout all error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during logout'
      });
    }
  }

  // Refresh access token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

      // Verify refresh token
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      // Find user and validate refresh token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      const storedToken = user.refreshTokens.find(
        token => token.token === refreshToken && token.expiresAt > new Date()
      );

      if (!storedToken) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired refresh token'
        });
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(user);

      res.json({
        success: true,
        data: {
          accessToken: newAccessToken,
          expiresIn: '15m'
        }
      });
    } catch (error) {
      logger.error('Refresh token error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during token refresh'
      });
    }
  }

  // Get user profile
  async getProfile(req, res) {
    try {
      const user = req.user;
      
      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            subscriptionPlan: user.subscriptionPlan,
            subscriptionStatus: user.subscriptionStatus,
            subscriptionEndDate: user.subscriptionEndDate,
            language: user.language,
            timezone: user.timezone,
            isEmailVerified: user.isEmailVerified,
            twoFactorEnabled: user.twoFactorEnabled,
            emailNotifications: user.emailNotifications,
            avatar: user.avatar,
            bio: user.bio,
            videosProcessedThisMonth: user.videosProcessedThisMonth,
            totalVideosProcessed: user.totalVideosProcessed,
            remainingQuota: user.getRemainingQuota(),
            storageUsed: user.storageUsed,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
          }
        }
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching profile'
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const user = req.user;
      const allowedUpdates = ['firstName', 'lastName', 'language', 'timezone', 'emailNotifications', 'bio'];
      const updates = {};

      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      Object.assign(user, updates);
      await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating profile'
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;
      const user = req.user;

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      // Invalidate all refresh tokens for security
      user.refreshTokens = [];
      await user.save();

      logger.info(`Password changed for user: ${user.email}`);

      res.json({
        success: true,
        message: 'Password changed successfully. Please log in again.'
      });
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while changing password'
      });
    }
  }

  // Forgot password
  async forgotPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email } = req.body;
      const user = await User.findByEmail(email);

      // Always return success to prevent email enumeration
      const successResponse = {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      };

      if (!user) {
        return res.json(successResponse);
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      user.passwordResetToken = resetToken;
      user.passwordResetExpires = resetExpires;
      await user.save();

      // Send reset email
      await emailService.sendPasswordResetEmail(user, resetToken);

      logger.info(`Password reset requested for: ${email}`);

      res.json(successResponse);
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while processing password reset request'
      });
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { token, password } = req.body;

      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      // Update password and clear reset token
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.refreshTokens = []; // Invalidate all sessions
      await user.save();

      logger.info(`Password reset completed for: ${user.email}`);

      res.json({
        success: true,
        message: 'Password reset successfully. Please log in with your new password.'
      });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while resetting password'
      });
    }
  }

  // Verify email
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token'
        });
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      logger.info(`Email verified for: ${user.email}`);

      res.json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      logger.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during email verification'
      });
    }
  }

  // Resend verification email
  async resendVerification(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email } = req.body;
      const user = await User.findByEmail(email);

      if (!user) {
        return res.json({
          success: true,
          message: 'If an account with that email exists and is not verified, a verification email has been sent.'
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email is already verified'
        });
      }

      // Generate new verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      user.emailVerificationToken = emailVerificationToken;
      user.emailVerificationExpires = emailVerificationExpires;
      await user.save();

      await emailService.sendVerificationEmail(user, emailVerificationToken);

      res.json({
        success: true,
        message: 'Verification email sent successfully'
      });
    } catch (error) {
      logger.error('Resend verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while resending verification email'
      });
    }
  }

  // Setup 2FA
  async setup2FA(req, res) {
    try {
      const user = req.user;

      if (user.twoFactorEnabled) {
        return res.status(400).json({
          success: false,
          message: 'Two-factor authentication is already enabled'
        });
      }

      const secret = speakeasy.generateSecret({
        name: `ViralCut Pro (${user.email})`,
        issuer: 'ViralCut Pro'
      });

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

      // Store secret temporarily (not enabled until verified)
      user.twoFactorSecret = secret.base32;
      await user.save();

      res.json({
        success: true,
        data: {
          secret: secret.base32,
          qrCode: qrCodeUrl,
          manualEntryKey: secret.base32
        }
      });
    } catch (error) {
      logger.error('Setup 2FA error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while setting up 2FA'
      });
    }
  }

  // Verify and enable 2FA
  async verify2FA(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { token } = req.body;
      const user = req.user;

      if (!user.twoFactorSecret) {
        return res.status(400).json({
          success: false,
          message: 'Two-factor authentication setup not initiated'
        });
      }

      const isValidToken = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
        window: 2
      });

      if (!isValidToken) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification token'
        });
      }

      // Generate backup codes
      const backupCodes = [];
      for (let i = 0; i < 10; i++) {
        backupCodes.push({
          code: crypto.randomBytes(4).toString('hex').toUpperCase(),
          used: false
        });
      }

      user.twoFactorEnabled = true;
      user.twoFactorBackupCodes = backupCodes;
      await user.save();

      logger.info(`2FA enabled for user: ${user.email}`);

      res.json({
        success: true,
        message: 'Two-factor authentication enabled successfully',
        data: {
          backupCodes: backupCodes.map(code => code.code)
        }
      });
    } catch (error) {
      logger.error('Verify 2FA error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while verifying 2FA'
      });
    }
  }

  // Disable 2FA
  async disable2FA(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { token } = req.body;
      const user = req.user;

      if (!user.twoFactorEnabled) {
        return res.status(400).json({
          success: false,
          message: 'Two-factor authentication is not enabled'
        });
      }

      const isValidToken = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
        window: 2
      });

      if (!isValidToken) {
        // Check backup codes
        const backupCode = user.twoFactorBackupCodes.find(
          code => code.code === token && !code.used
        );

        if (!backupCode) {
          return res.status(400).json({
            success: false,
            message: 'Invalid verification token'
          });
        }
      }

      user.twoFactorEnabled = false;
      user.twoFactorSecret = undefined;
      user.twoFactorBackupCodes = [];
      await user.save();

      logger.info(`2FA disabled for user: ${user.email}`);

      res.json({
        success: true,
        message: 'Two-factor authentication disabled successfully'
      });
    } catch (error) {
      logger.error('Disable 2FA error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while disabling 2FA'
      });
    }
  }

  // Get backup codes
  async getBackupCodes(req, res) {
    try {
      const user = req.user;

      if (!user.twoFactorEnabled) {
        return res.status(400).json({
          success: false,
          message: 'Two-factor authentication is not enabled'
        });
      }

      const unusedCodes = user.twoFactorBackupCodes
        .filter(code => !code.used)
        .map(code => code.code);

      res.json({
        success: true,
        data: {
          backupCodes: unusedCodes,
          totalCodes: user.twoFactorBackupCodes.length,
          usedCodes: user.twoFactorBackupCodes.filter(code => code.used).length
        }
      });
    } catch (error) {
      logger.error('Get backup codes error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching backup codes'
      });
    }
  }

  // Regenerate backup codes
  async regenerateBackupCodes(req, res) {
    try {
      const user = req.user;

      if (!user.twoFactorEnabled) {
        return res.status(400).json({
          success: false,
          message: 'Two-factor authentication is not enabled'
        });
      }

      // Generate new backup codes
      const backupCodes = [];
      for (let i = 0; i < 10; i++) {
        backupCodes.push({
          code: crypto.randomBytes(4).toString('hex').toUpperCase(),
          used: false
        });
      }

      user.twoFactorBackupCodes = backupCodes;
      await user.save();

      logger.info(`Backup codes regenerated for user: ${user.email}`);

      res.json({
        success: true,
        message: 'Backup codes regenerated successfully',
        data: {
          backupCodes: backupCodes.map(code => code.code)
        }
      });
    } catch (error) {
      logger.error('Regenerate backup codes error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while regenerating backup codes'
      });
    }
  }

  // Get user sessions
  async getSessions(req, res) {
    try {
      const user = req.user;

      const sessions = user.refreshTokens.map(token => ({
        id: token._id,
        deviceInfo: token.deviceInfo,
        createdAt: token.createdAt,
        expiresAt: token.expiresAt,
        isExpired: token.expiresAt < new Date()
      }));

      res.json({
        success: true,
        data: { sessions }
      });
    } catch (error) {
      logger.error('Get sessions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching sessions'
      });
    }
  }

  // Revoke specific session
  async revokeSession(req, res) {
    try {
      const { sessionId } = req.params;
      const user = req.user;

      user.refreshTokens = user.refreshTokens.filter(
        token => token._id.toString() !== sessionId
      );
      await user.save();

      res.json({
        success: true,
        message: 'Session revoked successfully'
      });
    } catch (error) {
      logger.error('Revoke session error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while revoking session'
      });
    }
  }

  // Delete account
  async deleteAccount(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { password } = req.body;
      const user = req.user;

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid password'
        });
      }

      // TODO: Add logic to cleanup user's videos and files
      // TODO: Cancel active subscriptions
      // TODO: Send account deletion confirmation email

      await User.findByIdAndDelete(user._id);

      logger.info(`Account deleted for user: ${user.email}`);

      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      logger.error('Delete account error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while deleting account'
      });
    }
  }

  // Helper methods
  generateAccessToken(user) {
    return jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        subscriptionPlan: user.subscriptionPlan
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );
  }
}

module.exports = new AuthController();
