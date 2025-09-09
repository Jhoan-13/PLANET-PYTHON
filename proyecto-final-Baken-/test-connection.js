const sequelize = require('./db');

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conneccion exitosa a postgreSQL.');
    } catch (err) {
        console.error("Error al conectar:", err.message);
    } finally {
        await sequelize.close();
    }   
})();