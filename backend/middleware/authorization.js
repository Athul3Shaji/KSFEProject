const jwt = require('jsonwebtoken');

const admin_verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            error_code: "NO_TOKEN_PROVIDED",
            message: "Access denied. No token provided."
        });
    }

    try {
        const decoded = jwt.verify(token, "ksfeproject");
        console.log(decoded)
        req.user = decoded; // Attach the decoded user to the request object
        if (req.user.user_type !== 'admin') {
            return res.status(403).json({
                error_code: "FORBIDDEN",
                message: "Access denied. You are not authorized to access this resource."
            });
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error_code: "TOKEN_EXPIRED",
                message: "Access denied. Token has expired."
            });
        } else {
            return res.status(400).json({
                error_code: "INVALID_TOKEN",
                message: "Invalid token."
            });
        }
    }
};



const user_verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            error_code: "NO_TOKEN_PROVIDED",
            message: "Access denied. No token provided."
        });
    }

    try {
        const decoded = jwt.verify(token, "ksfeproject");
        console.log(decoded)
        req.user = decoded; // Attach the decoded user to the request object
        if (req.user.user_type !== 'user') {
            return res.status(403).json({
                error_code: "FORBIDDEN",
                message: "Access denied. You are not authorized to access this resource."
            });
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error_code: "TOKEN_EXPIRED",
                message: "Access denied. Token has expired."
            });
        } else {
            return res.status(400).json({
                error_code: "INVALID_TOKEN",
                message: "Invalid token."
            });
        }
    }
};

module.exports = {admin_verifyToken, user_verifyToken};
