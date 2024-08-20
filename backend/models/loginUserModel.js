const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');


const User = sequelize.define('loginUser', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userpassword: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    user_type:{
        

        type: DataTypes.STRING,
        allowNull: true,
    },
    
}, {
    // Model options
    timestamps: true
});

// Sync the model with the database
sequelize.sync()
    .then(() => {
        
        console.log('User table created or already exists.');
    })
    .catch(err => {
        console.error('Error creating table:', err);
    });

module.exports = {User};