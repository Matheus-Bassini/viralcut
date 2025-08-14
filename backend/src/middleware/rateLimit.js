const rateLimit = require('express-rate-limit');

// General rate limiting
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

const rateLimitMiddleware = {
  // Authentication endpoints
  register: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // 5 attempts per window
    'Too many registration attempts. Please try again in 15 minutes.'
  ),

  login: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    10, // 10 attempts per window
    'Too many login attempts. Please try again in 15 minutes.'
  ),

  forgotPassword: createRateLimit(
    60 * 60 * 1000, // 1 hour
    3, // 3 attempts per window
    'Too many password reset requests. Please try again in 1 hour.'
  ),

  resetPassword: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // 5 attempts per window
    'Too many password reset attempts. Please try again in 15 minutes.'
  ),

  resendVerification: createRateLimit(
    60 * 60 * 1000, // 1 hour
    3, // 3 attempts per window
    'Too many verification email requests. Please try again in 1 hour.'
  ),

  refreshToken: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    20, // 20 attempts per window
    'Too many token refresh attempts. Please try again in 15 minutes.'
  ),

  // Video processing endpoints
  videoUpload: createRateLimit(
    60 * 60 * 1000, // 1 hour
    50, // 50 uploads per hour for free users
    'Upload limit exceeded. Please upgrade your plan or try again later.'
  ),

  videoProcess: createRateLimit(
    60 * 60 * 1000, // 1 hour
    100, // 100 processing requests per hour
    'Processing limit exceeded. Please try again later.'
  ),

  // Payment endpoints
  payment: createRateLimit(
    60 * 60 * 1000, // 1 hour
    10, // 10 payment attempts per hour
    'Too many payment attempts. Please try again in 1 hour.'
  ),

  // API endpoints
  api: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    1000, // 1000 requests per window
    'API rate limit exceeded. Please try again in 15 minutes.'
  ),

  // Strict rate limiting for sensitive operations
  strict: createRateLimit(
    60 * 60 * 1000, // 1 hour
    5, // 5 attempts per hour
    'Rate limit exceeded for this operation. Please try again in 1 hour.'
  ),

  // Custom rate limiter based on user subscription
  subscriptionBased: (req, res, next) => {
    const user = req.user;
    
    if (!user) {
      return next();
    }

    const limits = {
      free: { windowMs: 60 * 60 * 1000, max: 10 }, // 10 per hour
      pro: { windowMs: 60 * 60 * 1000, max: 50 }, // 50 per hour
      business: { windowMs: 60 * 60 * 1000, max: 200 }, // 200 per hour
      sacred: { windowMs: 60 * 60 * 1000, max: 1000 } // 1000 per hour
    };

    const userLimit = limits[user.subscriptionPlan] || limits.free;
    
    const limiter = createRateLimit(
      userLimit.windowMs,
      userLimit.max,
      `Rate limit exceeded for ${user.subscriptionPlan} plan. Please upgrade or try again later.`
    );

    return limiter(req, res, next);
  },

  // Dynamic rate limiting based on IP and user
  dynamic: (options = {}) => {
    const {
      windowMs = 15 * 60 * 1000,
      maxPerIP = 100,
      maxPerUser = 200,
      message = 'Rate limit exceeded'
    } = options;

    return rateLimit({
      windowMs,
      max: (req) => {
        // If user is authenticated, use higher limit
        if (req.user) {
          const userLimits = {
            free: Math.floor(maxPerUser * 0.5),
            pro: maxPerUser,
            business: Math.floor(maxPerUser * 2),
            sacred: Math.floor(maxPerUser * 5)
          };
          return userLimits[req.user.subscriptionPlan] || userLimits.free;
        }
        return maxPerIP;
      },
      keyGenerator: (req) => {
        // Use user ID if authenticated, otherwise use IP
        return req.user ? `user:${req.user._id}` : `ip:${req.ip}`;
      },
      message: {
        success: false,
        message
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        res.status(429).json({
          success: false,
          message,
          retryAfter: Math.round(windowMs / 1000)
        });
      }
    });
  }
};

module.exports = rateLimitMiddleware;
