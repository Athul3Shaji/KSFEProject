const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');

const Employee = sequelize.define('employee', {
    employee_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'ERR_EMPLOYEE_NAME_EMPTY|Employee name is required' },
        }
    },
    employee_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'ERR_EMPLOYEE_CODE_UNIQUE|Employee code must be unique'
        },
        validate: {
            notEmpty: { msg: 'ERR_EMPLOYEE_CODE_EMPTY|Employee code is required' }
        }
    },
    employee_mobile: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: {
            args: true,
            msg: 'ERR_EMPLOYEE_MOBILE_UNIQUE|Employee mobile must be unique'
        },
        validate: {
            isInt: { msg: 'ERR_EMPLOYEE_MOBILE_INVALID|Employee mobile must be a valid number' },
            notEmpty: { msg: 'ERR_EMPLOYEE_MOBILE_EMPTY|Employee mobile is required' },
            len: {
                args: [10, 10],
                msg: 'ERR_EMPLOYEE_MOBILE_LENGTH|Employee mobile must be 10 digits long'
            }
        }
    },
    employee_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'ERR_EMPLOYEE_EMAIL_UNIQUE|Employee email must be unique'
        },
        validate: {
            isEmail: { msg: 'ERR_EMPLOYEE_EMAIL_INVALID|Must be a valid email address' },
            notEmpty: { msg: 'ERR_EMPLOYEE_EMAIL_EMPTY|Employee email is required' }
        }
    },
    
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: true
});



sequelize.sync()
    .then(() => {
        
        console.log('Employee table created or already exists.');
    })
    .catch(err => {
        console.error('Error creating table:', err);
    });

module.exports = {Employee};