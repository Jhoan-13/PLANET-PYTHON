const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [5, Infinity]
    }
  },
  name: {
    type: DataTypes.STRING
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, Infinity]
    }
  },
  rol: {
    type: DataTypes.STRING,
    defaultValue: 'user'
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
  defaultScope: {
    attributes: { exclude: ['passwordHash'] }
  }
})

module.exports = User