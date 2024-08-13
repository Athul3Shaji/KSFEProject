const {Employee} = require('../models/employeeModel');


const add_employee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).send(employee.toJSON());
    } catch (error) {
        console.log(error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            res.status(500).send("Unexpected error occurred");
        }
    }
};

const get_employees = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            where: { isDeleted: false } // Filter out soft-deleted employees
        });
        res.status(200).json(employees);
    } catch (error) {
        console.log(error);
        res.status(500).send("Unexpected error occurred while fetching employees");
    }
};

const get_employee_by_id = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        console.log(employee.isDeleted)
        if (employee.isDeleted) {
            return res.status(400).json({ error: "Cannot update a deleted employee" });
        }


        res.status(200).json(employee);
    } catch (error) {
        console.log(error);
        res.status(500).send("Unexpected error occurred while fetching the employee");
    }
};

const update_employee = async (req, res) => {
    const { id } = req.params;
    const updatedData = {...req.body};

    try {
        const employee = await Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        console.log("stausssssss",employee.isDeleted)
        if (employee.isDeleted) {
            return res.status(400).json({ error: "Cannot update a deleted employee" });
        }

        // Update employee details
        await employee.update(updatedData);

        res.status(200).json(employee);
    } catch (error) {
        console.log(error);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            res.status(500).send("Unexpected error occurred while updating the employee");
        }
    }
};

const delete_employee = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Set isDeleted to true to soft delete
        employee.isDeleted = true;
        await employee.save();

        res.status(200).json({ message: "Employee successfully soft deleted" });
    } catch (error) {
        console.log(error);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            res.status(500).send("Unexpected error occurred while deleting the employee");
        }
    }
};




module.exports ={add_employee,get_employee_by_id,get_employees,update_employee,delete_employee}