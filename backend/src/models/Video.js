const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Owner Information
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  
  // Basic Video Information
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200]
    },
    set(value) {
      this.setDataValue('title', value.trim());
    }
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000]
    }
  },
  
  // Original Video Data (JSON field)
  originalFile: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  
  // Processing Status
  status: {
    type: DataTypes.ENUM('uploading', 'queued', 'processing', 'completed', 'failed', 'cancelled'),
    defaultValue: 'uploading'
  },
  
  processingProgress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  
  processingStartedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  processingCompletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  processingError: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // AI Analysis Results (JSON field)
  aiAnalysis: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  
  // Generated Clips (JSON field)
  generatedClips: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  
  // Platform-Specific Optimizations (JSON field)
  platformOptimizations: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  
  // User Customizations (JSON field)
  customizations: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  
  // Metadata
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  
  category: {
    type: DataTypes.ENUM('entertainment', 'education', 'business', 'sports', 'music', 'gaming', 'lifestyle', 'other'),
    defaultValue: 'other'
  },
  
  language: {
    type: DataTypes.STRING(10),
    defaultValue: 'pt-BR'
  },
  
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  // Analytics
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  
  downloads: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  
  shares: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  
  // Storage and Cleanup
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  storageUsed: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'videos',
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  
  // Indexes
  indexes: [
    {
      fields: ['userId', 'createdAt']
    },
    {
      fields: ['status']
    },
    {
      fields: ['category']
    },
    {
      fields: ['expiresAt']
    },
    {
      fields: ['isPublic']
    }
  ],
  
  // Hooks
  hooks: {
    beforeSave: (video) => {
      // Calculate storage used before saving
      video.calculateStorageUsed();
    },
    beforeDestroy: async (video) => {
      // Cleanup files before deletion
      console.log(`Cleaning up files for video: ${video.id}`);
      // TODO: Add actual file cleanup logic
    }
  }
});

// Instance methods
Video.prototype.getTotalClipsDuration = function() {
  if (!this.generatedClips || !Array.isArray(this.generatedClips)) {
    return 0;
  }
  return this.generatedClips.reduce((total, clip) => total + (clip.duration || 0), 0);
};

Video.prototype.getProcessingTime = function() {
  if (this.processingStartedAt && this.processingCompletedAt) {
    return this.processingCompletedAt - this.processingStartedAt;
  }
  return null;
};

Video.prototype.addClip = async function(clipData) {
  const clips = this.generatedClips || [];
  clips.push({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    ...clipData,
    createdAt: new Date()
  });
  this.generatedClips = clips;
  return this.save();
};

Video.prototype.updateClipStatus = async function(clipId, status, additionalData = {}) {
  const clips = this.generatedClips || [];
  const clipIndex = clips.findIndex(clip => clip.id === clipId);
  
  if (clipIndex === -1) {
    throw new Error('Clip not found');
  }
  
  clips[clipIndex] = {
    ...clips[clipIndex],
    status,
    ...additionalData
  };
  
  this.generatedClips = clips;
  return this.save();
};

Video.prototype.getClipsByPlatform = function(platform) {
  if (!this.generatedClips || !Array.isArray(this.generatedClips)) {
    return [];
  }
  return this.generatedClips.filter(clip => clip.platform === platform);
};

Video.prototype.calculateStorageUsed = function() {
  let total = 0;
  
  // Add original file size
  if (this.originalFile && this.originalFile.size) {
    total += this.originalFile.size;
  }
  
  // Add generated clips sizes
  if (this.generatedClips && Array.isArray(this.generatedClips)) {
    this.generatedClips.forEach(clip => {
      total += clip.fileSize || 0;
    });
  }
  
  this.storageUsed = total;
  return total;
};

Video.prototype.canProcess = async function() {
  const User = require('./User');
  const user = await User.findByPk(this.userId);
  return user ? user.canProcessVideo() : false;
};

// Class methods
Video.findByStatus = function(status) {
  return this.findAll({ 
    where: { status } 
  });
};

Video.findByUser = function(userId, options = {}) {
  const queryOptions = {
    where: { userId },
    order: [['createdAt', 'DESC']]
  };
  
  if (options.status) {
    queryOptions.where.status = options.status;
  }
  
  if (options.limit) {
    queryOptions.limit = options.limit;
  }
  
  if (options.sort) {
    queryOptions.order = options.sort;
  }
  
  return this.findAll(queryOptions);
};

Video.cleanupExpired = function() {
  return this.destroy({
    where: {
      expiresAt: {
        [sequelize.Sequelize.Op.lt]: new Date()
      }
    }
  });
};

// Associations
Video.associate = function(models) {
  // Video belongs to User
  Video.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Video;
