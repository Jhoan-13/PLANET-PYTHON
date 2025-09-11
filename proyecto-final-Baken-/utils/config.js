require('dotenv').config()

const config = {
  PORT: process.env.PORT || 3001,
  DATABASE_CONFIG: {
    username: 'postgres',
    password: 'Jhoan',
    database: 'PYTHON',
    host: 'localhost',
    dialect: 'postgres',
    port: 5432
  },
  SECRET: process.env.SECRET || 'your-secret-key'
}

module.exports = config
