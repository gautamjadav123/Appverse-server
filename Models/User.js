const { string } = require('joi');
const mongoose = require('mongoose');

// Function to generate a default avatar based on the first letter of the name
const getDefaultAvatarUrl = (name) => {
  const firstLetter = name.charAt(0).toUpperCase();
  return `https://dummyimage.com/100x100/000/fff&text=${firstLetter}`;
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleAuth: { type: Boolean, default: false },  // Indicates if the user used Google Auth
  
  // New fields for additional profile details
  username: { type: String, unique: true },
  fullName: { type: String },
  mobileNo: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  postalCode: { type: String },
  dob: { type: Date },
  address: { type: String },      // New field for user address
  occupation: { type: String },
  avatar: {type: String} ,  // New field for user occupation
  
  // Avatar URL field
  avatarUrl: {
    type: String,
    default: function() {
      return getDefaultAvatarUrl(this.name);  // Default avatar based on the first letter of name
    }
  },
});

// Export the model
module.exports = mongoose.model('User', userSchema);
