const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  comments: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'contacts',
  timestamps: true
});

module.exports = Contact;
