const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db'); 

const Chitty = sequelize.define('Chitty', {
  chitty_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'Chitty code is required' },
      notEmpty: { msg: 'Chitty code cannot be empty' },
      len: { args: [3, 20], msg: 'Chitty code must be between 3 and 20 characters long' },
    },
  },
  chitty_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Chitty name is required' },
      notEmpty: { msg: 'Chitty name cannot be empty' },
      len: { args: [3, 100], msg: 'Chitty name must be between 3 and 100 characters long' },
    },
  },
  chitty_tenure: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'Chitty tenure is required' },
      isInt: { msg: 'Chitty tenure must be an integer' },
      min: { args: [1], msg: 'Chitty tenure must be at least 1 month' },
      max: { args: [120], msg: 'Chitty tenure cannot exceed 120 months' },
    },
  },
  per_month_emi: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notNull: { msg: 'Per month EMI is required' },
      isFloat: { msg: 'Per month EMI must be a number' },
      min: { args: [0], msg: 'Per month EMI must be greater than or equal to 0' },
    },
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notNull: { msg: 'Total amount is required' },
      isFloat: { msg: 'Total amount must be a number' },
      min: { args: [0], msg: 'Total amount must be greater than or equal to 0' },
    },
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true, // This adds createdAt and updatedAt timestamps
  paranoid: true, // This ensures that 'deletedAt' is handled automatically
  tableName: 'chitties' // Optional: custom table name
});


sequelize.sync()
    .then(() => {
        
        console.log('Chitty table created or already exists.');
    })
    .catch(err => {
        console.error('Error creating table:', err);
    });

module.exports = Chitty;
