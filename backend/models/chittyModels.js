const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db'); 


const Chitty = sequelize.define('Chitty', {
  chitty_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'ERR_CHITTY_CODE_UNIQUE|Chitty code must be unique'
    },
    validate: {
      notNull: { msg: 'ERR_CHITTY_CODE_REQUIRED|Chitty code is required' },
      notEmpty: { msg: 'ERR_CHITTY_CODE_EMPTY|Chitty code cannot be empty' },
      len: {
        args: [3, 20],
        msg: 'ERR_CHITTY_CODE_LENGTH|Chitty code must be between 3 and 20 characters long'
      },
    },
  },
  chitty_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'ERR_CHITTY_NAME_REQUIRED|Chitty name is required' },
      notEmpty: { msg: 'ERR_CHITTY_NAME_EMPTY|Chitty name cannot be empty' },
      len: {
        args: [3, 100],
        msg: 'ERR_CHITTY_NAME_LENGTH|Chitty name must be between 3 and 100 characters long'
      },
    },
  },
  chitty_tenure: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'ERR_CHITTY_TENURE_REQUIRED|Chitty tenure is required' },
      isInt: { msg: 'ERR_CHITTY_TENURE_INT|Chitty tenure must be an integer' },
      min: {
        args: [1],
        msg: 'ERR_CHITTY_TENURE_MIN|Chitty tenure must be at least 1 month'
      },
      max: {
        args: [120],
        msg: 'ERR_CHITTY_TENURE_MAX|Chitty tenure cannot exceed 120 months'
      },
    },
  },
  per_month_emi: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notNull: { msg: 'ERR_CHITTY_EMI_REQUIRED|Per month EMI is required' },
      isFloat: { msg: 'ERR_CHITTY_EMI_FLOAT|Per month EMI must be a number' },
      min: {
        args: [0],
        msg: 'ERR_CHITTY_EMI_MIN|Per month EMI must be greater than or equal to 0'
      },
    },
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notNull: { msg: 'ERR_CHITTY_TOTAL_AMOUNT_REQUIRED|Total amount is required' },
      isFloat: { msg: 'ERR_CHITTY_TOTAL_AMOUNT_FLOAT|Total amount must be a number' },
      min: {
        args: [0],
        msg: 'ERR_CHITTY_TOTAL_AMOUNT_MIN|Total amount must be greater than or equal to 0'
      },
    },
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
  paranoid: true,  // Enables soft delete with 'deletedAt' column
  tableName: 'chitties' // Custom table name
});


sequelize.sync()
    .then(() => {
        
        console.log('Chitty table created or already exists.');
    })
    .catch(err => {
        console.error('Error creating table:', err);
    });

module.exports = Chitty;
