const User = require('../Models/User');

// Fetch user profile by user ID or email
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find user by ID (you can also use email if needed)
    const user = await User.findById(userId).select('-password'); // Do not return the password

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send user profile details, including avatarUrl
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching user profile' });
  }
};

module.exports = { getUserProfile };
