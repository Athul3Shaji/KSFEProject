const user_login = (req,res, next)=>{

    try {
        res.send("user_loging")
    } catch (error) {
        res.send(error)
    }

}


const admin_login = (req,res,next)=>{

    try {
        res.send("admin_loging")
    } catch (error) {
        res.send(error)
    }

}

module.exports= {user_login,admin_login}