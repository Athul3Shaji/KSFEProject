const express = require('express')
const { admin_login,user_login } = require('../controller/loginController')
const {add_employee, get_employees, get_employee_by_id,update_employee, delete_employee} = require('../controller/employeeController')
const router = express.Router()
const { add_agent,get_agent_by_id,get_agents,update_agent,delete_agent } = require('../controller/agentController')
const {add_chitty,get_chitty,get_chitty_by_id,delete_chitty,update_chitty} = require("../controller/chittyController")
const {add_user, get_users, get_user_by_id, update_user, delete_user, chitty_filter} = require('../controller/userController')
const {validateEmployee,validateAgent,validateChitty,validateUserRequest} =require('../middleware/validations')
const {admin_verifyToken,user_verifyToken}  = require('../middleware/authorization')

// routes of login
router.post('/user/login',user_login)
router.post('/admin/login',admin_login)

// routes of employee
router.post('/admin/employee/add',admin_verifyToken,validateEmployee,add_employee)
router.get('/admin/employee',get_employees)
router.get('/admin/employee/:id',admin_verifyToken,get_employee_by_id)
router.put('/admin/employee/update/:id', admin_verifyToken,validateEmployee,update_employee);
router.delete('/admin/employee/delete/:id',admin_verifyToken,delete_employee)

// routes of agents
router.post('/admin/agent/add',admin_verifyToken,validateAgent,add_agent)
router.get('/admin/agent',get_agents)
router.get('/admin/agent/:id',admin_verifyToken,get_agent_by_id)
router.put('/admin/agent/update/:id',admin_verifyToken,validateAgent,update_agent)
router.delete('/admin/agent/delete/:id',admin_verifyToken,delete_agent)

//routes of chitties
router.post('/admin/chitty/add',admin_verifyToken,validateChitty,add_chitty)
router.get('/admin/chitty',get_chitty)
router.get('/admin/chitty/:id',admin_verifyToken,get_chitty_by_id)
router.put('/admin/chitty/update/:id',admin_verifyToken,validateChitty,update_chitty)
router.delete('/admin/chitty/delete/:id',admin_verifyToken,delete_chitty)


// routes of user
router.post('/user/add',user_verifyToken,validateUserRequest,add_user)
router.get('/user',get_users)
router.get('/user/:id',user_verifyToken,get_user_by_id)
router.put('/user/update/:id',user_verifyToken,validateUserRequest,update_user)
router.delete('/user/delete/:id',user_verifyToken,delete_user)


// filter
router.get('/admin/search-user',admin_verifyToken,chitty_filter)

















module.exports = router