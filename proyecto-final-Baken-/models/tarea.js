const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Tarea = sequelize.define('Tarea', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  fechaLimite: {
    type: DataTypes.DATE,
    allowNull: false
  },
  preguntas: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  creadorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

module.exports = Tarea;
