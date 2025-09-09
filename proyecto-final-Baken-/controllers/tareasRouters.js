const express = require('express')
const Tarea = require('../models/tarea')
const User = require('../models/user')
const tareasRouter = express.Router()
const { userExtractor } = require('../utils/middleware')

// Get tasks based on role
tareasRouter.get('/mis-tareas', userExtractor, async (req, res) => {
  try {
    const usuario = req.user
    const query = usuario.Rol === 'maker' 
      ? { creador: usuario.id }
      : { 'userInfo.Rol': 'maker' }

    const tareas = await Tarea.find(query)
      .populate('creador', { username: 1, name: 1, Rol: 1 })
      .sort({ fechaLimite: 1 }) // Sort by deadline

    res.json(tareas)
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener las tareas',
      details: error.message 
    })
  }
})

// Añadir este nuevo endpoint GET
tareasRouter.get('/', async (req, res) => {
  try {
    const tareas = await Tarea.find({})
      .populate('creador', { username: 1, name: 1, Rol: 1 })
    res.json(tareas)
  } catch (error) {
    console.error('Error al obtener tareas:', error)
    res.status(500).json({ error: 'Error al obtener las tareas' })
  }
})

// POST para crear tarea con preguntas
tareasRouter.post('/', userExtractor, async (req, res) => {
  try {
    const { titulo, descripcion, fechaLimite, preguntas } = req.body
    const user = req.user

    // Validación básica
    if (!titulo) {
      return res.status(400).json({ error: 'El título es obligatorio' })
    }

    if (!fechaLimite) {
      return res.status(400).json({ error: 'La fecha límite es obligatoria' })
    }

    // Validación de preguntas
    if (!preguntas || !Array.isArray(preguntas) || preguntas.length === 0) {
      return res.status(400).json({ error: 'Debe proporcionar al menos una pregunta' })
    }

    // Validar estructura de cada pregunta
    for (const pregunta of preguntas) {
      if (!pregunta.pregunta) {
        return res.status(400).json({ error: 'Cada pregunta debe tener un texto' })
      }
      
      if (!pregunta.opciones || !Array.isArray(pregunta.opciones) || pregunta.opciones.length === 0) {
        return res.status(400).json({ error: 'Cada pregunta debe tener al menos una opción' })
      }

      // Verificar que haya exactamente una respuesta correcta
      const opcionesCorrectas = pregunta.opciones.filter(opcion => opcion.esCorrecta)
      if (opcionesCorrectas.length !== 1) {
        return res.status(400).json({ 
          error: 'Cada pregunta debe tener exactamente una opción correcta' 
        })
      }
    }

    const nuevaTarea = new Tarea({
      titulo,
      descripcion,
      fechaLimite: new Date(fechaLimite),
      completada: false,
      preguntas: preguntas.map(p => ({
        pregunta: p.pregunta,
        opciones: p.opciones,
        respuestas: []
      })),
      creador: user.id,
      nombreCreador: user.name,
      userInfo: {
        username: user.username,
        name: user.name,
        Rol: user.Rol
      }
    })

    const tareaGuardada = await nuevaTarea.save()
    await tareaGuardada.populate('creador', { username: 1, name: 1, Rol: 1 })
    res.status(201).json(tareaGuardada)
  } catch (error) {
    console.error('Error al crear tarea:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST response validation middleware
const validateResponse = (req, res, next) => {
  const { preguntaIndex, respuestaIndex } = req.body
  if (typeof preguntaIndex !== 'number' || typeof respuestaIndex !== 'number') {
    return res.status(400).json({ 
      error: 'Los índices deben ser números' 
    })
  }
  next()
}

// POST answer endpoint with validation
tareasRouter.post('/:id/responder', [userExtractor, validateResponse], async (req, res) => {
  try {
    const { preguntaIndex, respuestaIndex } = req.body
    const user = req.user

    if (user.Rol !== 'user') {
      return res.status(403).json({ 
        error: 'Solo los usuarios pueden responder tareas' 
      })
    }

    const tarea = await Tarea.findById(req.params.id)
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' })
    }

    // Validate indices
    if (!tarea.preguntas[preguntaIndex]) {
      return res.status(400).json({ error: 'Pregunta no encontrada' })
    }

    const pregunta = tarea.preguntas[preguntaIndex]
    if (!pregunta.opciones[respuestaIndex]) {
      return res.status(400).json({ error: 'Opción no encontrada' })
    }

    // Update response
    const respuestaExistente = pregunta.respuestas
      .findIndex(r => r.usuarioId.toString() === user.id.toString())

    if (respuestaExistente >= 0) {
      pregunta.respuestas[respuestaExistente].seleccion = respuestaIndex
    } else {
      pregunta.respuestas.push({ 
        usuarioId: user.id, 
        seleccion: respuestaIndex,
        fechaRespuesta: new Date()
      })
    }

    const tareaActualizada = await tarea.save()
    res.json(tareaActualizada)
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al procesar respuesta',
      details: error.message 
    })
  }
})

module.exports = tareasRouter
