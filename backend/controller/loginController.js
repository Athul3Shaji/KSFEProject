const {User} = require('../models/loginUserModel')
const jwt = require("jsonwebtoken")

const user_login = async (req, res, next) => {
    try {
        const { username } = req.body;
        console.log(username);

        const user = await User.findOne({ where: { username } });
        console.log(user.user_type )

        if (user.user_type == 'user') {
            console.log(user["dataValues"]);
            const token  =await jwt.sign(user["dataValues"], "ksfeproject",{
                expiresIn : '1hr'
            })
            console.log(token);
            
            
            return res.send({"user_accestoken": token});
        } else {
            // User not found, send a response indicating that
            return res.status(404).send("User not found");
        }

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("An error occurred during login");
    }
};


const admin_login = async (req,res,next)=>{

    try {
        const { username, userpassword } = req.body;
        console.log(username);

        const user = await User.findOne({ where: { username, userpassword } });

        if (user.user_type == 'admin' ) {
            console.log(user["dataValues"]);
            const token  =await jwt.sign(user["dataValues"], "ksfeproject",{
                expiresIn : '1hr'
            })
            console.log(token);
            
            
            return res.send({"admin_accestoken": token});
        } else {
            // Admin not found, send a response indicating that
            return res.status(404).send("AdminUser not found");
        }

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("An error occurred during login");
    }
};


module.exports= {user_login,admin_login}