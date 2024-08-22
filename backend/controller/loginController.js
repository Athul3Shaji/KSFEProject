const {User} = require('../models/loginUserModel')
const jwt = require("jsonwebtoken")

const user_login = async (req, res, next) => {
    try {
        const { username, userpassword } = req.body;

        if (!username || !userpassword) {
            return res.status(400).json({
                error_code: "INVALID_INPUT",
                message: "Username and Password are required."
            });
        }

        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({
                error_code: "USER_NOT_FOUND",
                message: "user not found."
            });
        }

        if (userpassword !== user.userpassword) {
            return res.status(400).json({
                error_code: "INVALID_CREDENTIALS",
                message: "Invalid username or password."
            });
        }

        if (user.user_type !== 'user') {
            return res.status(403).json({
                error_code: "NOT_USER",
                message: "User is not."
            });
        }

        const token = jwt.sign(user["dataValues"], "ksfeproject", {
            expiresIn: '1d' 
        });

        return res.status(200).json({
            user_accestoken: token,
            user_type: "user"
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            error_code: "SERVER_ERROR",
            message: "An error occurred during login."
        });
    }
};

const admin_login = async (req, res, next) => {
    try {
        const { username, userpassword } = req.body;

        if (!username || !userpassword) {
            return res.status(400).json({
                error_code: "INVALID_INPUT",
                message: "Username and password are required."
            });
        }

        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({
                error_code: "ADMIN_NOT_FOUND",
                message: "admin not found."
            });
        }

        if (userpassword !== user.userpassword) {
            return res.status(400).json({
                error_code: "INVALID_CREDENTIALS",
                message: "Invalid username or password."
            });
        }

        if (user.user_type !== 'admin') {
            return res.status(403).json({
                error_code: "NOT_ADMIN",
                message: "User is not an admin."
            });
        }

        const token = jwt.sign(user["dataValues"], "ksfeproject", {
            expiresIn: '1d' 
        });

        return res.status(200).json({
            admin_accestoken: token,
            user_type: "admin"
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            error_code: "SERVER_ERROR",
            message: "An error occurred during login."
        });
    }
};



module.exports= {user_login,admin_login}