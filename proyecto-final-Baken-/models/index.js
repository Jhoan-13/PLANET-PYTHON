const { sequelize } = require('../db');
const Blog = require('./blog');
const User = require('./user');
const Contact = require('./contact');
const Tarea = require('./tarea');

// Define associations
Blog.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Blog, {
  foreignKey: 'userId',
  as: 'blogs'
});

User.hasMany(Tarea, { 
  foreignKey: 'creadorId',
  as: 'tareasCreadas'
});

Tarea.belongsTo(User, { 
  foreignKey: 'creadorId',
  as: 'creador'
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Sync all models
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Models synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing models:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  Blog,
  User,
  Contact,
  Tarea,
  testConnection,
  syncModels
};