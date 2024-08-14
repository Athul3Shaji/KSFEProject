const express = require('express')
const { admin_login,user_login } = require('../controller/loginController')
const {add_employee, get_employees, get_employee_by_id,update_employee, delete_employee} = require('../controller/employeeController')
const router = express.Router()
const { add_agent,get_agent_by_id,get_agents,update_agent,delete_agent } = require('../controller/agentController')
const {validateEmployee,validateAgent} =require('../middleware/validations')

router.post('/user/login',user_login)
router.post('/admin/login', admin_login)
router.post('/admin/employee/add',validateEmployee,add_employee)
router.get('/admin/employee',get_employees)
router.get('/admin/employee/:id',get_employee_by_id)
router.put('/admin/employee/:id', validateEmployee,update_employee);
router.delete('/admin/employee/delete/:id',delete_employee)
router.post('/admin/agent/add',validateAgent,add_agent)
router.get('/admin/agent',get_agents)
router.get('/admin/agent/:id',get_agent_by_id)
router.put('/admin/agent/:id',validateAgent,update_agent)
router.delete('/admin/agent/:id',delete_agent)










module.exports = router