const User = require('../Models/User');
const cloudinary = require('../Models/cloudinaryConfig'); // Ensure this is set up correctly

// Update user profile
const updateProfile = async (req, res) => {
  try {
    // Debug log for starting the process
    console.log('Starting profile update...');

    // Check if user is authenticated and the user object exists
    if (!req.user || !req.user._id) {
      console.log('Unauthorized request: User is not authenticated');
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }

    const userId = req.user._id; // Get user ID from decoded JWT
    const updates = req.body; // Get the fields to update from the request body

    // Debug log for the received updates
    console.log(`Received updates for user ${userId}:`, updates);

    // Validate the input
    if (!updates.name || !updates.email) {
      console.log('Validation error: Name and email are required');
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check if there's an avatar to upload
    if (req.file) { // Assuming you're using multer for file uploads
      try {
        console.log('Uploading file to Cloudinary...');
        const uploadResponse = await cloudinary.uploader.upload(req.file.path);
        console.log('File uploaded successfully:', uploadResponse.secure_url);
        updates.avatar = uploadResponse.secure_url; // Get the URL from Cloudinary response
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError.message);
        return res.status(500).json({ message: 'Failed to upload image to Cloudinary' });
      }
    }

    // Debug log before updating the user profile
    console.log(`Updating user ${userId} with data:`, updates);

    // Find the user by ID and update the profile fields
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!updatedUser) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Debug log for successful update
    console.log('Profile updated successfully for user:', updatedUser._id);

    res.json({
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        country: updatedUser.country,
        state: updatedUser.state,
        city: updatedUser.city,
        postalCode: updatedUser.postalCode,
        dob: updatedUser.dob,
        mobileNo: updatedUser.mobileNo,
        avatar: updatedUser.avatar, // This will now include the updated avatar URL if it was uploaded
      },
    });
  } catch (error) {
    // Log the error with a stack trace for better debugging
    console.error('Error updating profile:', error.message, error.stack);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

module.exports = { updateProfile };
