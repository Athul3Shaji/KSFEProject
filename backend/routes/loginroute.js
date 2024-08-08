const express = require('express')
const { admin_login,user_login } = require('../controller/loginController')
const router = express.Router()
const db = require('../config/db')

router.post('/user/login',user_login)
router.post('/admin/login', admin_login)

module.exports = router