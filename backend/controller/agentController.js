const {Agent}  = require('../models/agentModels')


const add_agent = async (req, res) => {
    try {
        const agent = await Agent.create(req.body);
        res.status(201).send(agent.toJSON());
    } catch (error) {
        console.log(error);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            // Extract and format the errors
            const errors = error.errors.map(err => {
                const [code, message] = err.message.split('|'); // Split code and message
                console.log(code,message)
                return {
                    code: code || 'VALIDATION_ERROR',
                    message: message || err.message
                };
            });

            res.status(400).json({ errors });
        } else {
            res.status(500).send("Unexpected error occurred");
        }
    }
};


const get_agents = async (req, res) => {
    try {
        const agents = await Agent.findAll({
            where: { isDeleted: false },
            order: [['createdAt', 'DESC']]// Filter out soft-deleted agents
        });
        res.status(200).json(agents);
    } catch (error) {
        console.log(error);
        res.status(500).send("Unexpected error occurred while fetching agents");
    }
};

const get_agent_by_id = async (req, res) => {
    const { id } = req.params;

    try {
        const agent = await Agent.findByPk(id);

        if (!agent) {
            return res.status(404).json({ error: "Agent not found" });
        }
        console.log(agent.isDeleted)
        if (agent.isDeleted) {
            return res.status(400).json({ error: "Cannot update a deleted agent" });
        }


        res.status(200).json(agent);
    } catch (error) {
        console.log(error);
        res.status(500).send("Unexpected error occurred while fetching the agent");
    }
};

const update_agent = async (req, res) => {
    const { id } = req.params;
    const updatedData = {...req.body};

    try {
        const agent = await Agent.findByPk(id);

        if (!agent) {
            return res.status(404).json({ error: "Agent not found" });
        }
        console.log("stausssssss",agent.isDeleted)
        if (agent.isDeleted) {
            return res.status(400).json({ error: "Cannot update a deleted agent" });
        }

        // Update agent details
        await agent.update(updatedData);

        res.status(200).json(agent);
    } catch (error) {
        console.log(error);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            // Extract and format the errors
            const errors = error.errors.map(err => {
                const [code, message] = err.message.split('|'); // Split code and message
                console.log(code,message)
                return {
                    code: code || 'VALIDATION_ERROR',
                    message: message || err.message
                };
            });

            res.status(400).json({ errors });
        } else {
            res.status(500).send("Unexpected error occurred");
        }
    }
};

const delete_agent = async (req, res) => {
    const { id } = req.params;

    try {
        const agent = await Agent.findByPk(id);

        if (!agent) {
            return res.status(404).json({ error: "Agent not found" });
        }

        // Set isDeleted to true to soft delete
        agent.isDeleted = true;
        await agent.save();

        res.status(200).json({ message: "Agent successfully soft deleted" });
    } catch (error) {
        console.log(error);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            res.status(500).send("Unexpected error occurred while deleting the agent");
        }
    }
};


module.exports ={add_agent,update_agent,get_agent_by_id,get_agents,delete_agent}