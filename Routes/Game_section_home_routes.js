// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const App = require('../Models/GameApp');

// Route to get all homepage data
router.get('/game-homepage-alldata', async (req, res) => {
  try {
    const topPicksPC = await App.find({ type: 'top-pick-pc' });
    const favoritesPC = await App.find({ type: 'favorite-pc' });
    const vrGames = await App.find({ type: 'vr-game' });
    const newRelease = await App.find({ type: 'new-release' });

    res.json({
      topPicksPC,
      favoritesPC,
      vrGames,
      newRelease
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Individual route for Top Picks on PC
router.get('/top-picks-pc', async (req, res) => {
  try {
    const topPicksPC = await App.find({ type: 'top-pick-pc' });
    res.json(topPicksPC);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for Favorites on PC
router.get('/favorites-pc', async (req, res) => {
  try {
    const favoritesPC = await App.find({ type: 'favorite-pc' });
    res.json(favoritesPC);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for Top VR Games
router.get('/vr-games', async (req, res) => {
  try {
    const vrGames = await App.find({ type: 'vr-game' });
    res.json(vrGames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for New Releases
router.get('/new-release', async (req, res) => {
  try {
    const newRelease = await App.find({ type: 'new-release' });
    res.json(newRelease);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
