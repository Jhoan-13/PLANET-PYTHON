const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Get all users
usersRouter.get('/', async (request, response) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    response.json(users)
  } catch (error) {
    response.status(500).json({ error: 'Error retrieving users' })
  }
})

// Create new user
usersRouter.post('/', async (request, response) => {
  try {
    const { username, name, password, Rol } = request.body

    // Validate required fields
    if (!username || !password || !name) {
      return response.status(400).json({
        error: 'Username, password and name are required'
      })
    }

    // Validate username length
    if (username.length < 3) {
      return response.status(400).json({
        error: 'Username must be at least 3 characters long'
      })
    }

    // Validate password strength
    if (password.length < 6) {
      return response.status(400).json({
        error: 'Password must be at least 6 characters long'
      })
    }

    // Validate role
    const validRoles = ['user', 'maker', 'admin']
    if (!validRoles.includes(Rol)) {
      return response.status(400).json({
        error: 'Invalid role'
      })
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return response.status(400).json({
        error: 'Username already taken'
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
      Rol: Rol || 'user' // Default to 'user' if not specified
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    response.status(500).json({
      error: 'Error creating user',
      details: error.message
    })
  }
})

// Get makers
usersRouter.get('/makers', async (request, response) => {
  try {
    const makers = await User.find({ Rol: 'maker' })
      .select('id username name Rol')
    
    response.json(makers)
  } catch (error) {
    response.status(500).json({ error: 'Error retrieving makers' })
  }
})

module.exports = usersRouter