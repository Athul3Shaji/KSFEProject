const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust the path to your database configuration

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
        allowNull: false,
        unique: {
            msg: 'ERR_MOBILE_UNIQUE|Mobile already exists'
        },
        validate: {
            notEmpty: {
                msg: 'ERR_MOBILE_EMPTY|Mobile number cannot be empty'
            },
            isNumeric: {
                msg: 'ERR_MOBILE_NOT_NUMERIC|Mobile number must be numeric'
            },
            len: {
                args: [10, 15],
                msg: 'ERR_MOBILE_LENGTH|Mobile number must be between 10 and 15 characters'
            }
        }
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
        allowNull: false,
        unique: {
            msg: 'ERR_EMAIL_UNIQUE|Email already exists'
        },
        validate: {
            notEmpty: {
                msg: 'ERR_EMAIL_EMPTY|Email cannot be empty'
            },
            isEmail: {
                msg: 'ERR_EMAIL_INVALID|Email must be a valid email address'
            }
        }
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
                args: [6, 10],
                msg: 'ERR_PIN_LENGTH|PIN must be between 6 and 10 characters'
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
