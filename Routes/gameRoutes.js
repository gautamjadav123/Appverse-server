// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const Game = require('../Models/Game');
const User = require('../Models/User'); // Import the User model if it's used
const authMiddleware = require('../Middlewares/Auth');

// Route to add a review to a specific game
// routes/gameRoutes.js
router.post('/:id/reviews', authMiddleware, async (req, res) => {
    try {
      const { rating, comment } = req.body;
  
      // Find the logged-in user's details
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Find the game to add the review to
      const game = await Game.findById(req.params.id);
      if (!game) return res.status(404).json({ message: 'Game not found' });
  
      // Construct the new review object
      const newReview = {
        user: req.user._id,
        username: user.username || user.name, // Include username or name from the User model
        rating,
        comment,
        date: new Date(),
        avatar: user.avatar 
      };
  
      // Add the review to the game's reviews array
      game.reviews.push(newReview);
  
      // Update the rating breakdown array (index 0 for 1-star, index 1 for 2-star, etc.)
      game.ratings.breakdown[rating - 1] = (game.ratings.breakdown[rating - 1] || 0) + 1;
  
      // Recalculate the total rating based on all reviews
      const totalRatingSum = game.reviews.reduce((sum, review) => sum + review.rating, 0);
      game.ratings.totalRating = totalRatingSum / game.reviews.length;
  
      // Update the total reviews field
      game.totalReviews = `${game.reviews.length} reviews`;
  
      // Save the updated game document
      await game.save();
  
      // Respond with the new review including username and date
      res.json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

// Route to get details of a specific game
// routes/gameRoutes.js
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate({
      path: 'reviews.user',
      select: 'username avatar' // Include both username and avatar from the User model
    });

    if (!game) return res.status(404).json({ message: 'Game not found' });

    // Format reviews to include username and avatar directly in the response
    const formattedReviews = game.reviews.map(review => ({
      user: review.user._id,
      username: review.user.username,
      avatar: review.user.avatar,
      rating: review.rating,
      comment: review.comment,
      date: review.date,
      _id: review._id
    }));

    // Respond with the game data, including formatted reviews
    res.json({ ...game.toObject(), reviews: formattedReviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
