const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Rol: {
    type: DataTypes.ENUM('user', 'maker', 'admin'),
    defaultValue: 'user'
  }
}, {
  tableName: 'Users', // Match the table name in foreign key references
  timestamps: true
});

module.exports = User;