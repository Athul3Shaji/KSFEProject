const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');

const Agent = sequelize.define('Agent', {
    agent_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'ERR_AGENT_NAME_EMPTY|Agent name is required'
            }
        }
    },
    agent_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'ERR_AGENT_CODE_UNIQUE|Agent code must be unique'
        },
        validate: {
            notEmpty: {
                msg: 'ERR_AGENT_CODE_EMPTY|Agent code is required'
            }
        }
    },
    agent_mobile: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: {
            args: true,
            msg: 'ERR_AGENT_MOBILE_UNIQUE|Agent mobile must be unique'
        },
        validate: {
            isInt: {
                msg: 'ERR_AGENT_MOBILE_INVALID|Agent mobile must be a valid number'
            },
            notEmpty: {
                msg: 'ERR_AGENT_MOBILE_EMPTY|Agent mobile is required'
            },
            len: {
                args: [10, 10],
                msg: 'ERR_AGENT_MOBILE_LENGTH|Agent mobile must be 10 digits long'
            }
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
        
        console.log('Agent table created or already exists.');
    })
    .catch(err => {
        console.error('Error creating table:', err);
    });

module.exports = {Agent};