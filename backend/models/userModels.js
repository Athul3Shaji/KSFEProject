const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Adjust the path to your database configuration

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
        allowNull: false, // Updated to not allow null values
        unique: {
            msg: 'ERR_MOBILE_UNIQUE|Mobile number must be unique'
        },
        validate: {
            notEmpty: {
                msg: 'ERR_MOBILE_EMPTY|Mobile number cannot be empty'
            }
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    district: {
        type: DataTypes.STRING,
        allowNull: true // Adjusted to true as `null` is invalid
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pin: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isNumeric: {
                msg: 'ERR_PIN_NOT_NUMERIC|PIN must be numeric'
            },
            len: {
                args: [6, 6],
                msg: 'ERR_PIN_LENGTH|PIN must be 6 characters'
            }
        }
    },
    reference: {
        type: DataTypes.STRING,
        allowNull: false, // Updated to not allow null values
        validate: {
            notEmpty: {
                msg: 'ERR_REFERENCE_EMPTY|Reference cannot be empty'
            }
        }
    },
    reference_detail: {
        type: DataTypes.STRING,
        allowNull: false, // Updated to not allow null values
        validate: {
            notEmpty: {
                msg: 'ERR_REFERENCE_DETAIL_EMPTY|Reference detail cannot be empty'
            }
        }
    },
    chitties: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'ERR_CHITTY_EMPTY|Chitty data cannot be empty'
            },
            isArray(value) {
                if (!Array.isArray(value)) {
                    throw new Error('ERR_CHITTY_NOT_ARRAY|Chitty data must be an array');
                }
            }
        }
    },
    enrolled_chitties: {
        type: DataTypes.JSON,
        allowNull: true,
       
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: false, // Updated to not allow null values
        validate: {
            notEmpty: {
                msg: 'ERR_NOTES_EMPTY|Notes cannot be empty'
            }
        }
    },
    follow_up_date: {
        type: DataTypes.DATE,
        allowNull: true
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
