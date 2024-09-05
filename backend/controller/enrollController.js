const Enroll  = require('../models/enrollModels');
const User  = require('../models/userModels');
const Chitty  = require('../models/chittyModels');

// Function to add or update an Enroll record
const add_enroll = async (req, res) => {
    try {
        const { user_id, chitty_id, enroll_status } = req.body;
        console.log(req.body);
    
        // Check if the enroll record exists
        let enroll = await Enroll.findOne({ where: { user_id, chitty_id } });
    
        // Fetch the chitty details using the chitty_id
        const chittyDetails = await Chitty.findByPk(chitty_id);
    
        if (!chittyDetails) {
            return res.status(404).json({ message: 'Chitty not found.' });
        }
    
        // Create an object with chitty_id and chitty_name
        const chittyInfo = {
            id: chittyDetails.id,
            name: chittyDetails.chitty_name
        };
        console.log('Chitty Info:', chittyInfo);
    
        if (enroll) {
            // If the record exists, update it
            enroll.enroll_status = enroll_status;
            await enroll.save();
            console.log('Enroll record updated successfully.');
        } else {
            // If the record doesn't exist, create a new one
            enroll = await Enroll.create({ user_id, chitty_id, enroll_status });
            console.log('Enroll record created successfully.');
        }
    
        // Update the enrolled_chitties column in the User model
        const user = await User.findByPk(user_id);
        if (user) {
            // Initialize or get the current enrolled_chitties array (as JSON objects)
            let enrolledChitties = user.enrolled_chitties ? JSON.parse(user.enrolled_chitties) : [];
    
            if (enroll_status === 1) {
                // If enroll_status is 1, add the chittyInfo if not already present
                const exists = enrolledChitties.some(chitty => chitty.id === chitty_id);
                if (!exists) {
                    enrolledChitties.push(chittyInfo);
                }
            } else if (enroll_status === 0) {
                // If enroll_status is 0, remove the chittyInfo by chitty_id
                enrolledChitties = enrolledChitties.filter(chitty => chitty.id !== chitty_id);
            }
    
            // Update the user's enrolled_chitties array as a JSON string
            user.enrolled_chitties = JSON.stringify(enrolledChitties);
            await user.save();
            console.log('User enrolled_chitties updated successfully.');
        }
    
        return res.status(200).json({ message: 'Enroll operation completed successfully.', enroll });
    } catch (err) {
        console.error('Error in add_enroll:', err);
        return res.status(500).json({ message: 'An error occurred while processing the request.', error: err.message });
    }
    
};

module.exports = { add_enroll };
