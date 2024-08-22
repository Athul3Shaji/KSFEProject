const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_HOST, process.env.DATABASE_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging:false
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection to MySQL has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = {sequelize,Sequelize}; 