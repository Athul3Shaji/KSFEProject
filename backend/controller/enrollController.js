const Enroll  = require('../models/enrollModels');
const User  = require('../models/userModels');
const Chitty  = require('../models/chittyModels');

// Function to add or update an Enroll record
const add_enroll = async (req, res) => {
    try {
        const { user_id, chitty_id, enroll_status } = req.body;
        console.log(req.body);

        // Check if the record exists
        let enroll = await Enroll.findOne({ where: { user_id, chitty_id } });

        // Fetch the chitty details using the chitty_id
        const chittyDetails = await Chitty.findByPk(chitty_id);

        if (!chittyDetails) {
            return res.status(404).json({ message: 'Chitty not found.' });
        }

        // Get the chitty name
        const chittyName = chittyDetails.chitty_name;

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
            // Initialize or get the current enrolled_chitties array
            let enrolledChitties = user.enrolled_chitties ? user.enrolled_chitties.split(', ') : [];

            if (enroll_status === 1) {
                // If enroll_status is 1, add the chittyName to the array if not already present
                if (!enrolledChitties.includes(chittyName)) {
                    enrolledChitties.push(chittyName);
                }
            } else if (enroll_status === 0) {
                // If enroll_status is 0, remove the chittyName from the array
                enrolledChitties = enrolledChitties.filter(chitty => chitty !== chittyName);
            }

            // Update the user's enrolled_chitties array
            user.enrolled_chitties = enrolledChitties.join(', '); // Convert array back to string
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
