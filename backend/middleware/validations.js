const { body, validationResult } = require('express-validator');

const validateChitty = [
    body('chitty_code')
      .exists({ checkFalsy: true }).withMessage('Chitty code is required')
      .isLength({ min: 3, max: 20 }).withMessage('Chitty code must be between 3 and 20 characters long'),
    
    body('chitty_name')
      .exists({ checkFalsy: true }).withMessage('Chitty name is required')
      .isLength({ min: 3, max: 100 }).withMessage('Chitty name must be between 3 and 100 characters long'),
  
    body('chitty_tenure')
      .exists({ checkFalsy: true }).withMessage('Chitty tenure is required')
      .isInt({ min: 1, max: 120 }).withMessage('Chitty tenure must be an integer between 1 and 120'),
  
    body('per_month_emi')
      .exists({ checkFalsy: true }).withMessage('Per month EMI is required')
      .isFloat({ min: 0 }).withMessage('Per month EMI must be a non-negative number'),
  
    body('total_amount')
      .exists({ checkFalsy: true }).withMessage('Total amount is required')
      .isFloat({ min: 0 }).withMessage('Total amount must be a non-negative number')
  ];
  




const validateEmployee = (req, res, next) => {
    const { employee_name, employee_code, employee_mobile,employee_email } = req.body;

    // Check if 'employee_name' is a non-empty string
    if (!employee_name || typeof employee_name !== 'string') {
        return res.status(400).json({ error: "Invalid or missing 'employee_name'. It must be a non-empty string." });
    }

    // Check if 'employee_code' is a non-empty string
    if (!employee_code || typeof employee_code !== 'string') {
        return res.status(400).json({ error: "Invalid or missing 'employee_code'. It must be a non-empty string." });
    }

    if (!employee_email || typeof employee_email !== 'string') {
        return res.status(400).json({ error: "Invalid or missing 'employee_email'. It must be a non-empty string." });
    }


    // Check if 'employee_mobile' is a 10-digit number
    if (!employee_mobile || typeof employee_mobile !== 'number' || !/^\d{10}$/.test(employee_mobile.toString())) {
        return res.status(400).json({ error: "Invalid or missing 'employee_mobile'. It must be a 10-digit number." });
    }

    next();
};

const validateAgent = (req, res, next) => {
    const { agent_name, agent_code, agent_mobile } = req.body;

    if (!agent_name || typeof agent_name !== 'string') {
        return res.status(400).json({ error: "Invalid or missing 'agent_name'" });
    }

    if (!agent_code || typeof agent_code !== 'string') {
        return res.status(400).json({ error: "Invalid or missing 'agent_code'" });
    }

    if (!agent_mobile || typeof agent_mobile !== 'number' || !/^\d{10}$/.test(agent_mobile.toString())) {
        return res.status(400).json({ error: "Invalid or missing 'agent_mobile'. It must be a 10-digit number." });
    }

    next();
};

module.exports ={validateEmployee,validateAgent,validateChitty}