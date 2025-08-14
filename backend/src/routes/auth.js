const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const rateLimitMiddleware = require('../middleware/rateLimit');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('language')
    .optional()
    .isIn(['pt-BR', 'en', 'es'])
    .withMessage('Language must be pt-BR, en, or es')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

const twoFactorValidation = [
  body('token')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('2FA token must be a 6-digit number')
];

// Public routes
router.post('/register', 
  rateLimitMiddleware.register,
  registerValidation, 
  authController.register
);

router.post('/login', 
  rateLimitMiddleware.login,
  loginValidation, 
  authController.login
);

router.post('/forgot-password', 
  rateLimitMiddleware.forgotPassword,
  forgotPasswordValidation, 
  authController.forgotPassword
);

router.post('/reset-password', 
  rateLimitMiddleware.resetPassword,
  resetPasswordValidation, 
  authController.resetPassword
);

router.post('/verify-email/:token', 
  authController.verifyEmail
);

router.post('/resend-verification', 
  rateLimitMiddleware.resendVerification,
  body('email').isEmail().normalizeEmail(),
  authController.resendVerification
);

router.post('/refresh-token', 
  rateLimitMiddleware.refreshToken,
  authController.refreshToken
);

// Protected routes (require authentication)
router.use(authMiddleware.authenticate);

router.post('/logout', authController.logout);
router.post('/logout-all', authController.logoutAll);

router.get('/me', authController.getProfile);
router.put('/me', 
  [
    body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
    body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
    body('language').optional().isIn(['pt-BR', 'en', 'es']),
    body('timezone').optional().isString(),
    body('emailNotifications').optional().isBoolean()
  ],
  authController.updateProfile
);

router.post('/change-password', 
  changePasswordValidation, 
  authController.changePassword
);

// Two-Factor Authentication routes
router.post('/2fa/setup', authController.setup2FA);
router.post('/2fa/verify', 
  twoFactorValidation, 
  authController.verify2FA
);
router.post('/2fa/disable', 
  twoFactorValidation, 
  authController.disable2FA
);
router.get('/2fa/backup-codes', authController.getBackupCodes);
router.post('/2fa/regenerate-backup-codes', authController.regenerateBackupCodes);

// Session management
router.get('/sessions', authController.getSessions);
router.delete('/sessions/:sessionId', authController.revokeSession);

// Account management
router.delete('/account', 
  body('password').notEmpty().withMessage('Password is required for account deletion'),
  authController.deleteAccount
);

module.exports = router;
