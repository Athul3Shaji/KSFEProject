const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db'); // Adjust the path to your database configuration

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'ERR_NAME_EMPTY|Name cannot be empty'
            }
        }
    },
    mobile_number: {
        type: DataTypes.STRING,
        allowNull: true,
       
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'ERR_ADDRESS_EMPTY|Address cannot be empty'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull:true,
       
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'ERR_DISTRICT_EMPTY|District cannot be empty'
            }
        }
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'ERR_STATE_EMPTY|State cannot be empty'
            }
        }
    },
    pin: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'ERR_PIN_EMPTY|PIN cannot be empty'
            },
            isNumeric: {
                msg: 'ERR_PIN_NOT_NUMERIC|PIN must be numeric'
            },
            len: {
                args: [6, 6],
                msg: 'ERR_PIN_LENGTH|PIN must be  6  characters'
            }
        }
    },
    reference: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reference_detail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    chitties: {
        type: DataTypes.JSON, // Store multiple chitty data as JSON array
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'ERR_CHITTY_EMPTY|Chitty data cannot be empty'
            },
            isArray(value) { // Custom validator to check if the value is an array
                if (!Array.isArray(value)) {
                    throw new Error('ERR_CHITTY_NOT_ARRAY|Chitty data must be an array');
                }
            }
        }
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'users',
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

sequelize.sync()
    .then(() => {
        console.log('User table created or already exists.');
    })
    .catch(err => {
        console.error('Error creating table:', err);
    });

module.exports = User;
