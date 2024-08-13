const express = require('express')
const { admin_login,user_login } = require('../controller/loginController')
const {add_employee, get_employees, get_employee_by_id,update_employee, delete_employee} = require('../controller/employeeController')
const router = express.Router()
const db = require('../config/db')

router.post('/user/login',user_login)
router.post('/admin/login', admin_login)
router.post('/admin/employee/add',add_employee)
router.get('/admin/employee',get_employees)
router.get('/admin/employee/:id',get_employee_by_id)
router.put('/admin/employee/:id', update_employee);
router.delete('/admin/employee/delete/:id',delete_employee)





module.exports = router