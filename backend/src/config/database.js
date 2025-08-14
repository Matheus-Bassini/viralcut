const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuração do banco de dados MySQL para Hostinger
const sequelize = new Sequelize(
  process.env.DB_NAME || 'u206326127_viralcut',
  process.env.DB_USER || 'u206326127_host',
  process.env.DB_PASS || '@Host1603',
  {
    host: process.env.DB_HOST || 'srv1883.hstgr.io',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    charset: process.env.DB_CHARSET || 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    timezone: process.env.DB_TIMEZONE || '+00:00',
    
    // Pool de conexões
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    
    // Configurações de logging
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    
    // Configurações específicas para Hostinger
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      supportBigNumbers: true,
      bigNumberStrings: true,
      dateStrings: true,
      typeCast: true,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : false
    },
    
    // Configurações de performance
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true,
      underscored: false,
      freezeTableName: false,
      paranoid: false
    },
    
    // Retry de conexão
    retry: {
      max: 3,
      timeout: 5000,
      match: [
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /TIMEOUT/,
        /ESOCKETTIMEDOUT/,
        /EHOSTUNREACH/,
        /EPIPE/,
        /EAI_AGAIN/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ]
    }
  }
);

// Função para testar conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com MySQL estabelecida com sucesso.');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com MySQL:', error.message);
    return false;
  }
};

// Função para sincronizar modelos
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ 
      force, 
      alter: process.env.NODE_ENV === 'development' 
    });
    console.log('✅ Modelos sincronizados com o banco de dados.');
    return true;
  } catch (error) {
    console.error('❌ Erro ao sincronizar modelos:', error.message);
    return false;
  }
};

// Função para fechar conexão
const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('✅ Conexão com MySQL fechada.');
  } catch (error) {
    console.error('❌ Erro ao fechar conexão:', error.message);
  }
};

// Event listeners para conexão
sequelize.addHook('beforeConnect', (config) => {
  console.log('🔄 Conectando ao MySQL...');
});

sequelize.addHook('afterConnect', (connection, config) => {
  console.log('✅ Conectado ao MySQL com sucesso.');
});

sequelize.addHook('beforeDisconnect', (connection) => {
  console.log('🔄 Desconectando do MySQL...');
});

sequelize.addHook('afterDisconnect', (connection) => {
  console.log('✅ Desconectado do MySQL.');
});

// Tratamento de erros de conexão
sequelize.addHook('beforeQuery', (options, query) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Executando query:', query.sql);
  }
});

// Configurações específicas para produção
if (process.env.NODE_ENV === 'production') {
  // Configurações adicionais para produção na Hostinger
  sequelize.options.dialectOptions = {
    ...sequelize.options.dialectOptions,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    idleTimeout: 300000
  };
}

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  closeConnection,
  Sequelize
};
