const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');


const Employee  = sequelize.define('employee',{
    employee_name :{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Employee name is required" },
        }

    },
    employee_code:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "Employee code must be unique"
        },
        validate: {
            notEmpty: { msg: "Employee code is required" }
        }

    },
    employee_mobile: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: {
            args: true,
            msg: "Employee mobile must be unique"
        },
        validate: {
            isInt: { msg: "Employee mobile must be a valid number" },
            notEmpty: { msg: "Employee mobile is required" },
            len: {
                args: [10, 10],
                msg: "Employee mobile must be 10 digits long"
            }
        }
    },
    employee_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "Employee email must be unique"
        },
        validate: {
            isEmail: { msg: "Must be a valid email address" },
            notEmpty: { msg: "Employee email is required" }
        }
    },
    
    isDeleted :{
        type:DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }

},{
    timestamps:true
})



sequelize.sync()
    .then(() => {
        
        console.log('Employee table created or already exists.');
    })
    .catch(err => {
        console.error('Error creating table:', err);
    });

module.exports = {Employee};