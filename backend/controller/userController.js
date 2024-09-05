const User = require('../models/userModels');
const { Op, sequelize,Sequelize } = require('sequelize');
const Chitty = require("../models/chittyModels");
const { Enroll } = require('../models/enrollModels');



const add_user = async (req, res) => {
    try {
   
        const userData = { ...req.body };

        // Check if follow_up_date is an empty string and set it to the current date if true
        if (userData.follow_up_date === '') {
            userData.follow_up_date = new Date(); // Set current date and time
        }

        // Create a new user
        const user = await User.create(userData);
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


const get_users = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { isDeleted: false },
            order: [['createdAt', 'DESC']]// Filter out soft-deleted users
        });
        
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send("Unexpected error occurred while fetching users");
    }
};

const get_user_by_id = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }
        console.log(user.isDeleted)
        if (user.isDeleted) {
            return res.status(400).json({ error: "Cannot update a deleted user" });
        }
        console.log("---",user.chitties)
         const chittiesIds = user.chitties;
         let enrolledChitties = JSON.parse(user.enrolled_chitties);


        // Fetch the Chitty details based on the chittiesIds array
        const chittiesDetails = await Chitty.findAll({
            where: {
                id: chittiesIds,
                isDeleted: false
            },
           
        });
        const chittyNames = chittiesDetails.map(chitty => chitty);
        console.log(chittyNames);
        
        user.chitties = chittyNames
        user.enrolled_chitties = enrolledChitties


        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Unexpected error occurred while fetching the user");
    }
};

const update_user = async (req, res) => {
    const { id } = req.params;
    const updatedData = {...req.body};

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }
        console.log("stausssssss",user.isDeleted)
        if (user.isDeleted) {
            return res.status(400).json({ error: "Cannot update a deleted user" });
        }

        // Update user details
        await user.update(updatedData);

        res.status(200).json(user);
    } catch (error) {
        console.log(error);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            res.status(500).send("Unexpected error occurred while updating the user");
        }
    }
};

const delete_user = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }

        // Set isDeleted to true to soft delete
        user.isDeleted = true;
        await user.save();

        res.status(200).json({ message: "user successfully soft deleted" });
    } catch (error) {
        console.log(error);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            res.status(500).send("Unexpected error occurred while deleting the user");
        }
    }
};


const chitty_filter = async (req, res) => {
    try {
        const { chittyIds } = req.query; // Assume chittyIds is passed as a query parameter

        if (!chittyIds) {
            return res.status(400).json({ error: 'chittyIds query parameter is required.' });
        }

        // Use sequelize.literal with the correct instance
        const users = await User.findAll({
            where: {
                isDeleted: false,
                [Sequelize.Op.and]: Sequelize.literal(`JSON_CONTAINS(chitties, '${chittyIds}')`)
            },
            order: [['createdAt', 'DESC']]
        });

        return res.json(users);
    } catch (error) {
        console.error('Error searching users by chitties:', error);
        return res.status(500).json({ error: 'An error occurred while searching for users.' });
    }
}



module.exports = {add_user,get_user_by_id,get_users,update_user,delete_user,chitty_filter}