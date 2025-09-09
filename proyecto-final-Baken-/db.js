const{ Sequelize } = require('sequelize');

const sequelize = new Sequelize('localhost', 'postgres', 'Jhoan',{
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;