const express = require('express')
const { admin_login,user_login } = require('../controller/loginController')
const {add_employee, get_employees, get_employee_by_id,update_employee, delete_employee} = require('../controller/employeeController')
const router = express.Router()
const { add_agent,get_agent_by_id,get_agents,update_agent,delete_agent } = require('../controller/agentController')
const {add_chitty,get_chitty,get_chitty_by_id,delete_chitty,update_chitty} = require("../controller/chittyController")
const {add_user, get_users, get_user_by_id, update_user, delete_user} = require('../controller/userController')
const {validateEmployee,validateAgent,validateChitty,validateUserRequest} =require('../middleware/validations')

// routes of login
router.post('/user/login',user_login)
router.post('/admin/login', admin_login)

// routes of employee
router.post('/admin/employee/add',validateEmployee,add_employee)
router.get('/admin/employee',get_employees)
router.get('/admin/employee/:id',get_employee_by_id)
router.put('/admin/employee/update/:id', validateEmployee,update_employee);
router.delete('/admin/employee/delete/:id',delete_employee)

// routes of agents
router.post('/admin/agent/add',validateAgent,add_agent)
router.get('/admin/agent',get_agents)
router.get('/admin/agent/:id',get_agent_by_id)
router.put('/admin/agent/update/:id',validateAgent,update_agent)
router.delete('/admin/agent/delete/:id',delete_agent)

//routes of chitties
router.post('/admin/chitty/add',validateChitty,add_chitty)
router.get('/admin/chitty',get_chitty)
router.get('/admin/chitty/:id',get_chitty_by_id)
router.put('/admin/chitty/update/:id',validateChitty,update_chitty)
router.delete('/admin/chitty/delete/:id',delete_chitty)


// routes of user
router.post('/user/add',validateUserRequest,add_user)
router.get('/user',get_users)
router.get('/user/:id',get_user_by_id)
router.put('/user/update/:id',validateUserRequest,update_user)
router.delete('/user/delete/:id',delete_user)


















module.exports = router