const User = require('../models/userModels');


const add_user = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).send(user.toJSON());
    } catch (error) {
        console.log(error);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            // Extract and format the errors
            const errors = error.errors.map(err => {
                const [code, message] = err.message.split('|'); // Split code and message
                console.log(code,message)
                return {
                    code: code || 'VALIDATION_ERROR',
                    message: message || err.message
                };
            });

            res.status(400).json({ errors });
        } else {
            res.status(500).send("Unexpected error occurred");
        }
    }
};



module.exports = {add_user}