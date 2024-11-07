// models/Game.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  rating: Number,
  comment: String,
  date: { type: Date, default: Date.now }
});

const gameSchema = new mongoose.Schema({
  name: String,
  developer: String,
  version: String,
  rating: Number,
  totalReviews: String,
  size: String,
  recommendedAge: String,
  imageUrl: String,
  screenshots: [String],
  availableOn: [String],
  description: String,
  dataSecurity: String,
  similarGames: [
    {
      name: String,
      rating: Number,
      price: String,
      imageUrl: String,
      installLink: String
    }
  ],
  ratings: {
    totalRating: Number,
    breakdown: [Number]
  },
  reviews: [reviewSchema]
});

module.exports = mongoose.model('Game', gameSchema);
