const express = require('express');
const router = express.Router();
const mediaData = require('../data/mediaData'); // Adjust path if necessary

// Example route
router.post('/get-related-media', (req, res) => {
    const { publicId } = req.body; // Assuming you send publicId in the request body
    const media = mediaData[publicId];

    if (media) {
        res.json(media);
    } else {
        res.status(404).json({ error: 'Media not found' });
    }
});

module.exports = router;
