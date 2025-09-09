const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  try {
    const { username, password } = request.body

    if (!username || !password) {
      return response.status(400).json({
        error: 'username and password are required'
      })
    }

    const user = await User.findOne({ username })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password'
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id,
      name: user.name,
      Rol: user.Rol
    }

    const token = jwt.sign(
      userForToken,
      process.env.SECRET,
      { 
        expiresIn: 60*60,
        algorithm: 'HS256'  // Explicitly specify algorithm
      }
    )

    response.status(200).json({ 
      token, 
      username: user.username, 
      name: user.name, 
      Rol: user.Rol,
      userId: user._id,
      expiresIn: 3600  // Add token expiration time in seconds
    })
  } catch (error) {
    response.status(500).json({
      error: 'server error during authentication'
    })
  }
})

module.exports = loginRouter