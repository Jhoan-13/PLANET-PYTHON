const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, Infinity]
    }
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, Infinity]
    }
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, Infinity]
    }
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

module.exports = Blog
