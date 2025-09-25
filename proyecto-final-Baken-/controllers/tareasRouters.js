const express = require('express')
const { Tarea, User } = require('../models')
const tareasRouter = express.Router()
const { userExtractor } = require('../utils/middleware')

// Ruta pública para ver todas las tareas
tareasRouter.get('/', async (req, res) => {
  try {
    const tareas = await Tarea.findAll({
      include: [{
        model: User,
        as: 'creador',
        attributes: ['username', 'name', 'Rol']
      }],
      order: [['createdAt', 'DESC']]
    })
    res.json(tareas)
  } catch (error) {
    console.error('Error al obtener tareas:', error)
    res.status(500).json({ error: 'Error al obtener las tareas' })
  }
})

// Obtener tareas según el rol
tareasRouter.get('/mis-tareas', userExtractor, async (req, res) => {
  try {
    const user = req.user

    // Si es profesor, obtiene sus tareas creadas
    if (user.Rol === 'profesor') {
      const tareas = await Tarea.findAll({
        where: { creadorId: user.id },
        include: [{
          model: User,
          as: 'creador',
          attributes: ['username', 'name', 'Rol']
        }]
      })
      return res.json(tareas)
    }

    // Si es usuario, obtiene todas las tareas disponibles
    if (user.Rol === 'usuario') {
      const tareas = await Tarea.findAll({
        include: [{
          model: User,
          as: 'creador',
          attributes: ['username', 'name', 'Rol']
        }]
      })
      return res.json(tareas)
    }

    return res.status(403).json({ error: 'Rol no autorizado' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener las tareas' })
  }
})

// Crear tarea (solo profesores)
tareasRouter.post('/', userExtractor, async (req, res) => {
  try {
    const user = req.user
    
    if (user.Rol !== 'profesor') {
      return res.status(403).json({ error: 'Solo los profesores pueden crear tareas' })
    }

    const { titulo, descripcion, fechaLimite, preguntas } = req.body

    // Validaciones
    if (!titulo || !fechaLimite || !preguntas || !Array.isArray(preguntas)) {
      return res.status(400).json({ error: 'Datos inválidos' })
    }

    const tarea = await Tarea.create({
      titulo,
      descripcion,
      fechaLimite,
      preguntas,
      creadorId: user.id
    })

    res.status(201).json(tarea)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear la tarea' })
  }
})

module.exports = tareasRouter
