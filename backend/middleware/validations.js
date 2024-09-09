const { body, validationResult } = require('express-validator');

const validateChitty = [
    body('chitty_code')
      .exists({ checkFalsy: true }).withMessage('Chitty code is required')
      .isLength({ min: 3, max: 20 }).withMessage('Chitty code must be between 3 and 20 characters long'),
    
    body('chitty_name')
      .exists({ checkFalsy: true }).withMessage('Chitty name is required')
      .isLength({ min: 3, max: 100 }).withMessage('Chitty name must be between 3 and 100 characters long'),
  
    body('chitty_tenure')
      .exists({ checkFalsy: true }).withMessage('Chitty tenure is required'),
  
    body('per_month_emi')
      .exists({ checkFalsy: true }).withMessage('Per month EMI is required')
      .isFloat({ min: 0 }).withMessage('Per month EMI must be a non-negative number'),
  
    body('total_amount')
      .exists({ checkFalsy: true }).withMessage('Total amount is required')
      .isFloat({ min: 0 }).withMessage('Total amount must be a non-negative number')
  ];
  

  
const validateUserRequest = [
    body('name')
        .notEmpty().withMessage('ERR_NAME_EMPTY|Name cannot be empty')
        .isString().withMessage('ERR_NAME_NOT_STRING|Name must be a string'),
    body('mobile_number')
        .notEmpty().withMessage('ERR_MOBILE_EMPTY|Mobile number cannot be empty')
        .isNumeric().withMessage('ERR_MOBILE_NOT_NUMERIC|Mobile number must be numeric')
        .isLength({ min: 10, max: 15 }).withMessage('ERR_MOBILE_LENGTH|Mobile number must be between 10 and 15 characters'),
    body('address')
        .optional()
        .isString().withMessage('ERR_ADDRESS_NOT_STRING|Address must be a string'),
    body('email')
        .optional(),
    body('district')
        .optional()
        .isString().withMessage('ERR_DISTRICT_NOT_STRING|District must be a string'),
    body('state')
        .optional()
        .isString().withMessage('ERR_STATE_NOT_STRING|State must be a string'),
    body('reference')
        .notEmpty().withMessage('ERR_REFERENCE_EMPTY|Reference cannot be empty')
        .isString().withMessage('ERR_REFERENCE_NOT_STRING|Reference must be a string'),
    body('reference_detail')
        .notEmpty().withMessage('ERR_REFERENCE_DETAIL_EMPTY|Reference detail cannot be empty')
        .isString().withMessage('ERR_REFERENCE_DETAIL_NOT_STRING|Reference detail must be a string'),
    body('chitties')
        .notEmpty().withMessage('ERR_CHITTY_EMPTY|Chitty data cannot be empty')
        .isArray().withMessage('ERR_CHITTY_NOT_ARRAY|Chitty data must be an array'),
    body('notes')
        .notEmpty().withMessage('ERR_NOTES_EMPTY|Notes cannot be empty')
        .isString().withMessage('ERR_NOTES_NOT_STRING|Notes must be a string'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorResponse = errors.array().map(error => {
                const [code, message] = error.msg.split('|');
                return { code, message, field: error.param };
            });
            return res.status(400).json({ errors: errorResponse });
        }
        next();
    }
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

module.exports ={validateEmployee,validateAgent,validateChitty,validateUserRequest}