const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ksfe', 'root', 'jinivjoy123#', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection to MySQL has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize; 