const usersRouter = require('express').Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');

// Get all users
usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.findAll({
      where: {},
      attributes: ['id', 'username', 'name', 'Rol']
    });
    response.json(users);
  } catch (error) {
    response.status(500).json({ error: 'Error retrieving users' });
  }
});

// Create new user
usersRouter.post('/', async (request, response) => {
  try {
    const { username, name, password, Rol } = request.body;

    // Validate required fields
    if (!username || !password || !name) {
      return response.status(400).json({
        error: 'Username, password and name are required'
      });
    }

    // Validate username length
    if (username.length < 3) {
      return response.status(400).json({
        error: 'Username must be at least 3 characters long'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return response.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    // Validate role
    const validRoles = ['user', 'maker', 'admin'];
    if (!validRoles.includes(Rol)) {
      return response.status(400).json({
        error: 'Invalid role'
      });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return response.status(400).json({
        error: 'Username already taken'
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      username,
      name,
      passwordHash,
      Rol: Rol || 'user' // Default to 'user' if not specified
    });

    response.status(201).json({
      id: user.id,
      username: user.username,
      name: user.name,
      Rol: user.Rol
    });
  } catch (error) {
    response.status(500).json({
      error: 'Error creating user',
      details: error.message
    });
  }
});

// Delete user
usersRouter.delete('/:id', async (request, response) => {
  try {
    const id = request.params.id;

    // Verificar si el usuario existe
    const user = await User.findByPk(id);
    if (!user) {
      return response.status(404).json({
        error: 'User not found'
      });
    }

    // Eliminar el usuario
    await user.destroy();
    response.status(204).end();
  } catch (error) {
    response.status(500).json({
      error: 'Error deleting user',
      details: error.message
    });
  }
});

module.exports = usersRouter;