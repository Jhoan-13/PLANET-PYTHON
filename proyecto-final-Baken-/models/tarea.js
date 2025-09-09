const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Tarea extends Model {}

Tarea.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING
  },
  fechaLimite: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfterNow(value) {
        if (value <= new Date()) {
          throw new Error('La fecha límite debe ser posterior a la fecha actual');
        }
      }
    }
  },
  completada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  pregunta: {
    type: DataTypes.STRING,
    allowNull: false
  },
  opciones: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidOptions(value) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('Debe proporcionar al menos una opción');
        }
        value.forEach(opcion => {
          if (!opcion.texto || typeof opcion.esCorrecta !== 'boolean') {
            throw new Error('Cada opción debe tener texto y esCorrecta');
          }
        });
      }
    }
  },
  respuestas: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  creadorId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  nombreCreador: {
    type: DataTypes.STRING
  },
  userInfo: {
    type: DataTypes.JSON
  },
  usuariosCompletaron: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'tarea'
})

module.exports = Tarea
