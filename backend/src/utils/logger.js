const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which logs to print based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define different log formats
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const fileLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    level: level(),
    format: logFormat
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    format: fileLogFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
    format: fileLogFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5
  })
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format: fileLogFormat,
  transports,
  exitOnError: false
});

// Create a stream object for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

// Add custom methods for specific use cases
logger.logUserAction = (userId, action, details = {}) => {
  logger.info(`User Action: ${action}`, {
    userId,
    action,
    details,
    timestamp: new Date().toISOString()
  });
};

logger.logVideoProcessing = (videoId, userId, status, details = {}) => {
  logger.info(`Video Processing: ${status}`, {
    videoId,
    userId,
    status,
    details,
    timestamp: new Date().toISOString()
  });
};

logger.logPayment = (userId, action, amount, currency, details = {}) => {
  logger.info(`Payment: ${action}`, {
    userId,
    action,
    amount,
    currency,
    details,
    timestamp: new Date().toISOString()
  });
};

logger.logSecurity = (event, details = {}) => {
  logger.warn(`Security Event: ${event}`, {
    event,
    details,
    timestamp: new Date().toISOString()
  });
};

logger.logError = (error, context = {}) => {
  logger.error('Application Error', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    context,
    timestamp: new Date().toISOString()
  });
};

logger.logAPICall = (method, url, statusCode, responseTime, userId = null) => {
  logger.http(`API Call: ${method} ${url}`, {
    method,
    url,
    statusCode,
    responseTime,
    userId,
    timestamp: new Date().toISOString()
  });
};

// Export the logger
module.exports = logger;
