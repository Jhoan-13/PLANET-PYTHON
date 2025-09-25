const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const { User } = require('../models')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
  try {
    const { username, password } = request.body

    // Validar que se proporcionen las credenciales
    if (!username || !password) {
      return response.status(400).json({
        error: 'Se requiere usuario y contraseña'
      })
    }

    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'username', 'name', 'passwordHash', 'Rol']
    })

    // Verificar si el usuario existe
    if (!user) {
      return response.status(401).json({
        error: 'Usuario no encontrado'
      })
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

    if (!passwordCorrect) {
      return response.status(401).json({
        error: 'Contraseña incorrecta'
      })
    }

    // Verificar que SECRET esté definido
    if (!config.SECRET) {
      console.error('ERROR: Variable SECRET no definida')
      return response.status(500).json({
        error: 'Error de configuración del servidor'
      })
    }

    const userForToken = {
      username: user.username,
      id: user.id,
      Rol: user.Rol
    }

    const token = jwt.sign(
      userForToken, 
      config.SECRET, 
      { expiresIn: '24h' }
    )

    // Enviar respuesta exitosa
    response.status(200).json({
      token,
      username: user.username,
      name: user.name,
      Rol: user.Rol,
      id: user.id
    })

  } catch (error) {
    console.error('Error en login:', error)
    response.status(500).json({ 
      error: 'Error en el servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

module.exports = loginRouter