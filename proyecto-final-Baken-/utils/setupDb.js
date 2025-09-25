const { sequelize } = require('../db');
const { User, Blog, Contact, Tarea } = require('../models');
const logger = require('./logger');

const setupDatabase = async () => {
  try {
    // Force sync only on first run
    await sequelize.sync({ force: true });
    logger.info('Database tables created');

    // Create default admin user
    await User.create({
      username: 'admin',
      name: 'Administrator',
      passwordHash: await require('bcrypt').hash('admin123', 10),
      Rol: 'administrador'
    });

    logger.info('Initial setup completed');
    process.exit(0);
  } catch (error) {
    logger.error('Setup failed:', error);
    process.exit(1);
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}