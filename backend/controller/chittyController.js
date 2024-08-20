const Chitty = require("../models/chittyModels")
const { body, validationResult } = require('express-validator');



const add_chitty = async(req,res)=>{
      // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }

    try {
        const chitty = await Chitty.create(req.body);
        res.status(201).send(chitty.toJSON())

    } catch (error) {
        console.log(error)
        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            const errors = error.errors.map(err =>err.message);
            res.status(400).json({errors})
        } else {
            res.status(500).send("Unexpected error occurred");
        }
    

        
    }

}

const get_chitty = async(req, res)=>{
    try {
        const chitties = await Chitty.findAll({
            where:{isDeleted : false},
            order:[['createdAt','DESC']]
            
        });
        res.status(200).json(chitties)
    } catch (error) {
        console.log(error);
        
        res.status(500).send("Unexpected error occurred while fetching chittys");

    }
   
}
const get_chitty_by_id  = async(req,res)=>{
    const { id } = req.params;
    try {
        const chitty = await Chitty.findByPk(id) 
        if (!chitty) {
            return res.status(404).json({ error: "Chitty not found" });
        }
        if (chitty.isDeleted) {
            return res.status(400).json({ error: "Cannot update a deleted chitty" });
        }


        res.status(200).json(chitty);
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Unexpected error occurred while fetching the chitty");
    }
}


const update_chitty = async (req, res) => {
    const { id } = req.params;
    const updatedData = {...req.body};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(err => err.msg) });
    }
  

    try {
        const chitty = await Chitty.findByPk(id);

        if (!chitty) {
            return res.status(404).json({ error: "chitty not found" });
        }
        console.log("stausssssss",chitty.isDeleted)
        if (chitty.isDeleted) {
            return res.status(400).json({ error: "Cannot update a deleted chitty" });
        }

        // Update chitty details
        await chitty.update(updatedData);

        res.status(200).json(chitty);
    } catch (error) {
        console.log(error);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            res.status(500).send("Unexpected error occurred while updating the chitty");
        }
    }
};

const delete_chitty = async (req, res) => {
    const { id } = req.params;

    try {
        const chitty = await Chitty.findByPk(id);

        if (!chitty) {
            return res.status(404).json({ error: "chitty not found" });
        }

        // Set isDeleted to true to soft delete
        chitty.isDeleted = true;
        await chitty.save();

        res.status(200).json({ message: "chitty successfully soft deleted" });
    } catch (error) {
        console.log(error);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            res.status(500).send("Unexpected error occurred while deleting the chitty");
        }
    }
};


chitty_filter = async(req,res)=>{
    
}


module.exports ={add_chitty,get_chitty,get_chitty_by_id,update_chitty,delete_chitty}