const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Basic Information
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      len: [5, 255]
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    }
  },
  
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [8, 255]
    }
  },
  
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100]
    },
    set(value) {
      this.setDataValue('firstName', value.trim());
    }
  },
  
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100]
    },
    set(value) {
      this.setDataValue('lastName', value.trim());
    }
  },
  
  // Account Status
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  
  // Subscription Information
  subscriptionPlan: {
    type: DataTypes.ENUM('free', 'pro', 'business', 'sacred'),
    defaultValue: 'free'
  },
  
  subscriptionStatus: {
    type: DataTypes.ENUM('active', 'inactive', 'cancelled', 'expired'),
    defaultValue: 'active'
  },
  
  subscriptionStartDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  
  subscriptionEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  stripeCustomerId: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  
  stripeSubscriptionId: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  
  // Usage Tracking
  videosProcessedThisMonth: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  
  totalVideosProcessed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  
  storageUsed: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  
  // Two-Factor Authentication
  twoFactorSecret: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  
  twoFactorEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  twoFactorBackupCodes: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  
  // Preferences
  language: {
    type: DataTypes.ENUM('pt-BR', 'en', 'es'),
    defaultValue: 'pt-BR'
  },
  
  timezone: {
    type: DataTypes.STRING(100),
    defaultValue: 'America/Sao_Paulo'
  },
  
  emailNotifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  
  // Security
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  loginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  
  lockUntil: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  passwordResetToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  emailVerificationToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  
  emailVerificationExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Session Management
  refreshTokens: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  
  // Profile
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  
  // Analytics
  lastActiveAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  
  signupSource: {
    type: DataTypes.ENUM('web', 'mobile', 'referral', 'social'),
    defaultValue: 'web'
  }
}, {
  tableName: 'users',
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  
  // Indexes
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['subscriptionPlan']
    },
    {
      fields: ['subscriptionStatus']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['isEmailVerified']
    }
  ],
  
  // Hooks
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  
  // Default scope (exclude sensitive fields)
  defaultScope: {
    attributes: {
      exclude: ['password', 'twoFactorSecret', 'passwordResetToken', 'emailVerificationToken']
    }
  },
  
  // Scopes
  scopes: {
    withPassword: {
      attributes: {}
    },
    active: {
      where: {
        isActive: true
      }
    },
    verified: {
      where: {
        isEmailVerified: true
      }
    }
  }
});

// Virtual fields
User.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

User.prototype.getIsLocked = function() {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  const user = await User.scope('withPassword').findByPk(this.id);
  return bcrypt.compare(candidatePassword, user.password);
};

User.prototype.incLoginAttempts = async function() {
  const updates = {};
  
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    updates.lockUntil = null;
    updates.loginAttempts = 1;
  } else {
    updates.loginAttempts = this.loginAttempts + 1;
    
    // Lock account after 5 failed attempts for 2 hours
    if (updates.loginAttempts >= 5 && !this.getIsLocked()) {
      updates.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    }
  }
  
  return this.update(updates);
};

User.prototype.resetLoginAttempts = async function() {
  return this.update({
    loginAttempts: 0,
    lockUntil: null
  });
};

User.prototype.canProcessVideo = function() {
  const limits = {
    free: 5,
    pro: 50,
    business: 200,
    sacred: Infinity
  };
  
  return this.videosProcessedThisMonth < limits[this.subscriptionPlan];
};

User.prototype.getRemainingQuota = function() {
  const limits = {
    free: 5,
    pro: 50,
    business: 200,
    sacred: Infinity
  };
  
  const limit = limits[this.subscriptionPlan];
  return limit === Infinity ? Infinity : Math.max(0, limit - this.videosProcessedThisMonth);
};

User.prototype.hasActiveSubscription = function() {
  return this.subscriptionStatus === 'active' && 
         (!this.subscriptionEndDate || this.subscriptionEndDate > new Date());
};

// Class methods
User.findByEmail = function(email) {
  return this.findOne({ 
    where: { 
      email: email.toLowerCase() 
    } 
  });
};

User.resetMonthlyUsage = function() {
  return this.update(
    { videosProcessedThisMonth: 0 },
    { where: {} }
  );
};

// Associations will be defined in a separate file
User.associate = function(models) {
  // User has many Videos
  User.hasMany(models.Video, {
    foreignKey: 'userId',
    as: 'videos'
  });
};

module.exports = User;
