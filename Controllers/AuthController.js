const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');
const { OAuth2Client } = require('google-auth-library');

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await UserModel.findOne({ email });
      
      if (user) {
        return res.status(409).json({
          message: "User already exists, you can login",
          success: false,
        });
      }
      
      const newUser = new UserModel({ name, email, password });
      newUser.password = await bcrypt.hash(password, 10);
      await newUser.save();

      // Return the _id along with the signup success message
      res.status(201).json({
        message: "Signup successfully",
        success: true,
        _id: newUser._id,   // Include the MongoDB _id in the response
        name: newUser.name,
        email: newUser.email
      });
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error", success: false });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Auth failed. Email or password is wrong';
        
        if (!user) {
            return res.status(403).json({ message: errorMsg, success: false });
        }
        
        const isPassEqual = await bcrypt.compare(password, user.password);
        
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMsg, success: false });
        }
        
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return the _id along with the other fields
        res.status(200).json({
            message: "Login success",
            success: true,
            jwtToken,
            email,
            name: user.name,
            _id: user._id   // Include the MongoDB _id in the response
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};





// Forgot Password handler
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email doesn't exist", success: false });
        }

        // Check if the user signed up with Google OAuth (no password)
        if (!user.password) {
            return res.status(400).json({ message: "This account uses Google login. Please use Google to sign in.", success: false });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Set reset token and expiry time (1 hour)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send email with reset link
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;  // Frontend URL
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Reset Your Password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
                    <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        Hello ${user.name || 'User'},<br><br>
                        You're receiving this email because you (or someone else) have requested a password reset for your account. If this was you, click the button below to reset your password.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background-color: #007bff; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-size: 16px; display: inline-block;">
                           Reset Password
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #777; text-align: center;">
                        Or copy and paste this link into your browser:<br>
                        <a href="${resetUrl}" style="color: #007bff; word-wrap: break-word;">${resetUrl}</a>
                    </p>
                    <p style="font-size: 14px; color: #555; line-height: 1.6;">
                        If you did not request this, please ignore this email and your password will remain unchanged.<br><br>
                        Thank you,<br>
                        The Support Team
                    </p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ message: 'Error sending reset email', success: false });
            }
            res.status(200).json({ message: 'Password reset link sent to email', success: true });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Reset Password handler
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Ensure token hasn't expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired', success: false });
        }

        // Hash new password
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully', success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};



const googleAuth = async (req, res) => {
    const { token } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Make sure to use the correct Google Client ID
      });
      const payload = ticket.getPayload();
      const userId = payload.sub;
      const { name, email, picture } = payload;
  
      // Check if user exists
      let user = await UserModel.findOne({ email });
      if (!user) {
        // If user does not exist, create a new user (for Google Signup)
        const hashedPassword = await bcrypt.hash('randompassword', 10); // Use a dummy password for Google users
        user = new UserModel({ name, email, password: hashedPassword, googleAuth: true });
        await user.save();
      }
  
      // Generate JWT token
      const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.status(200).json({ success: true, message: 'Logged in successfully', jwtToken, name: user.name });
    } catch (error) {
      console.error('Error verifying Google token:', error);
      res.status(400).json({ success: false, message: 'Invalid Google token' });
    }
  };




module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword,
    googleAuth
  
};
