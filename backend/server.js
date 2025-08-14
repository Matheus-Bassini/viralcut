const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { testConnection, syncDatabase } = require('./src/config/database');
const logger = require('./src/utils/logger');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
// const videoRoutes = require('./src/routes/video');
// const userRoutes = require('./src/routes/user');
// const paymentRoutes = require('./src/routes/payment');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      connectSrc: ["'self'", "https:"],
      frameSrc: ["'self'", "https://js.stripe.com"]
    }
  }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://seudominio.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ 
  limit: process.env.MAX_FILE_SIZE || '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: process.env.MAX_FILE_SIZE || '50mb' 
}));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.logAPICall(req.method, req.originalUrl, res.statusCode, duration, req.user?.id);
  });
  
  next();
});

// Database initialization
const initializeDatabase = async () => {
  try {
    logger.info('🔄 Inicializando conexão com MySQL...');
    
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Falha na conexão com MySQL');
    }
    
    logger.info('🔄 Sincronizando modelos...');
    const isSynced = await syncDatabase(process.env.NODE_ENV === 'development');
    if (!isSynced) {
      throw new Error('Falha na sincronização dos modelos');
    }
    
    logger.info('✅ Banco de dados MySQL inicializado com sucesso');
    return true;
  } catch (error) {
    logger.error('❌ Erro na inicialização do banco de dados:', error);
    return false;
  }
};

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/video', videoRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await testConnection();
    
    res.status(200).json({
      success: true,
      status: 'OK',
      message: 'ViralCut Pro API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        type: 'MySQL',
        status: dbStatus ? 'connected' : 'disconnected',
        host: process.env.DB_HOST
      },
      version: '1.0.0'
    });
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(503).json({
      success: false,
      status: 'Service Unavailable',
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'ViralCut Pro API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      health: '/api/health'
    },
    documentation: 'https://seudominio.com/docs'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.logError(err, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  });

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Resource already exists',
      field: err.errors[0]?.path
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /api',
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login'
    ]
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('🔄 Recebido SIGTERM, iniciando shutdown graceful...');
  
  const { closeConnection } = require('./src/config/database');
  await closeConnection();
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('🔄 Recebido SIGINT, iniciando shutdown graceful...');
  
  const { closeConnection } = require('./src/config/database');
  await closeConnection();
  
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Initialize database first
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      logger.error('❌ Falha na inicialização do banco de dados. Servidor não será iniciado.');
      process.exit(1);
    }

    // Start HTTP server
    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 ViralCut Pro server running on port ${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/api/health`);
      
      if (process.env.NODE_ENV === 'production') {
        logger.info(`🌐 Production URL: ${process.env.FRONTEND_URL}`);
      }
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${PORT} is already in use`);
      } else {
        logger.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    return server;
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = app;
