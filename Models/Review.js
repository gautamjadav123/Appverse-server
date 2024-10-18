// models/Review.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    appId: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    title: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    avatarUrl: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

   
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
