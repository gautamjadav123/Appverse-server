const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User already exists, you can login",
        success: false,
      });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate a JWT token for the new user
    const jwtToken = jwt.sign(
      { email: newUser.email, _id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send success response with JWT token
    res.status(201).json({
      message: "Signup successful",
      success: true,
      jwtToken,
      email: newUser.email,
      name: newUser.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// const signup = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const user = await UserModel.findOne({ email });
//     if (user) {
//       return res.status(409).json({
//         message: "User already exists, you can login",
//         success: false,
//       });
//     }
//     const newUser = new UserModel({ name, email, password });
//     newUser.password = await bcrypt.hash(password, 10);
//     await newUser.save();
//     res.status(201).json({ message: "Signup successfully", success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error", success: false });
//   }
// };

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed. Email or password is wrong";
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
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login success",
      success: true,
      jwtToken,
      email,
      name: user.name,
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
      return res.status(404).json({
        message: "User with this email doesn't exist",
        success: false,
      });
    }

    // Check if the user signed up with Google OAuth (no password)
    if (!user.password) {
      return res.status(400).json({
        message:
          "This account uses Google login. Please use Google to sign in.",
        success: false,
      });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Set reset token and expiry time (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with reset link
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`; // Frontend URL
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Reset Your Password",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
                    <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        Hello ${user.name || "User"},<br><br>
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
            `,
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error("Error sending email:", err);
        return res
          .status(500)
          .json({ message: "Error sending reset email", success: false });
      }
      res
        .status(200)
        .json({ message: "Password reset link sent to email", success: true });
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
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token hasn't expired
    });

    if (!user) {
      return res.status(400).json({
        message: "Password reset token is invalid or has expired",
        success: false,
      });
    }

    // Hash new password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Password has been reset successfully", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
};
