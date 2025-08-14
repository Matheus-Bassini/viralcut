const { sequelize } = require('../config/database');
const User = require('./User');
const Video = require('./Video');

// Initialize models
const models = {
  User,
  Video
};

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  ...models
};
