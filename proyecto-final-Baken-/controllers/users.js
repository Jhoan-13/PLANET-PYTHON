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

const validRoles = ['usuario', 'profesor', 'administrador'];

// Create new user
usersRouter.post('/', async (request, response) => {
  try {
    const { username, name, password, Rol } = request.body;

    // Validate required fields
    if (!username || !password || !name) {
      return response.status(400).json({
        error: 'El usuario, contraseña y nombre son requeridos'
      });
    }

    // Validate role
    if (!validRoles.includes(Rol)) {
      return response.status(400).json({
        error: 'Rol inválido. Debe ser: usuario, profesor o administrador'
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      username,
      name,
      passwordHash,
      Rol
    });

    response.status(201).json({
      id: user.id,
      username: user.username,
      name: user.name,
      Rol: user.Rol
    });
  } catch (error) {
    console.error('Error creating user:', error);
    response.status(400).json({
      error: error.message
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