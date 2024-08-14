const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Agent = sequelize.define('Agent',{
    agent_name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Agent name is required" },
        }


    },
    agent_code:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "Agent code must be unique"
        },
        validate: {
            notEmpty: { msg: "Agent code is required" }
        }

    }, 
    agent_mobile: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: {
            args: true,
            msg: "Agent mobile must be unique"
        },
        validate: {
            isInt: { msg: "Agent mobile must be a valid number" },
            notEmpty: { msg: "Agent mobile is required" },
            len: {
                args: [10, 10],
                msg: "Agent mobile must be 10 digits long"
            }
        }
    },
    isDeleted :{
        type:DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }

},{
    timestamps:true
}
)
sequelize.sync()
    .then(() => {
        
        console.log('Agent table created or already exists.');
    })
    .catch(err => {
        console.error('Error creating table:', err);
    });

module.exports = {Agent};