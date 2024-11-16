// routes/vrGameRoutes.js
const express = require('express');
const router = express.Router();
const VRGame = require('../Models/VRGame'); // Adjust path if necessary

// Route to get all VR games with a static banner image URL
router.get('/', async (req, res) => {
  try {
    // Static banner image URL
    const bannerImageUrl = 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1731085361/Frame_119695_ydjljc.png'; // Replace with the actual URL of the banner image

    // Fetch the VR games data
    const vrGames = await VRGame.find().select('name rating imageUrl installLink');

    // Send the banner image URL and VR games in the response
    res.json({
      bannerImageUrl,
      vrGames
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get details of a specific VR game
router.get('/:id', async (req, res) => {
  try {
    const vrGame = await VRGame.findById(req.params.id);
    if (!vrGame) return res.status(404).json({ message: 'VR Game not found' });
    res.json(vrGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
