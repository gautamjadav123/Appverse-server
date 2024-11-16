// models/VRGame.js
const mongoose = require('mongoose');

const vrGameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  description: String, // No longer required
  imageUrl: String, // No longer required
  installLink: String, // No longer required
  category: String, // No longer required
  screenshots: [String],
  size: String,
  developer: String,
  recommendedAge: String,
  totalDownloads: String
}, { collection: 'VRGames' }); // Explicitly set the collection name to VRGames

module.exports = mongoose.model('VRGame', vrGameSchema);
