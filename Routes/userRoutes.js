// userRoutes.js
const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../Middlewares/Auth'); // Import authentication middleware
const User = require('../Models/User'); 

// Route to get user profile details of the logged-in user
router.get('/profile', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id; // Use the logged-in user's ID from the authentication middleware

        const user = await User.findById(userId).select('-password'); // Fetch the user without the password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate default avatar from the user's name initials if no avatar is set
        const avatar = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;

        return res.json({
            username: user.username,
            fullName: user.name,
            email: user.email,
            country: user.country,
            state: user.state,
            city: user.city,
            postalCode: user.postalCode,
            dob: user.dob,
            mobile: user.mobileNo,
            avatar: avatar // Use the generated or user-defined avatar
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
