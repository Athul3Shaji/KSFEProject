const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');


const Enroll = sequelize.define('enroll', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    chitty_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      
    },
    enroll_status:{
        

        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    
}, {
    // Model options
    timestamps: true
});

// Sync the model with the database
sequelize.sync()
    .then(() => {
        
        console.log('Enroll table created or already exists.');
    })
    .catch(err => {
        console.error('Enroll creating table:', err);
    });

module.exports = Enroll;