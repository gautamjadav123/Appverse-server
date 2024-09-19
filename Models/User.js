const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },  // Password is optional for Google OAuth users
    resetPasswordToken: String,  // Add reset token field
    resetPasswordExpires: Date   // Add token expiry field
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
