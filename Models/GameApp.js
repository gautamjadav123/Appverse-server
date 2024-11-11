// models/App.js
const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  price: String,
  imageUrls: [String],  // Array to store multiple image URLs
  installLink: String,
  category: String,     // e.g., "Adventure", "Racing"
  type: String,         // e.g., 'top-pick-pc', 'favorite-pc', 'vr-game', 'new-release'
});

module.exports = mongoose.model('GameApp', appSchema);



