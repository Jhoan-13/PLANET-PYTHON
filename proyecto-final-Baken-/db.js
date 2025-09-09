const{ Sequelize } = require('sequelize');

const sequelize = new Sequelize('PYTHON', 'postgres', 'Jhoan',{
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;