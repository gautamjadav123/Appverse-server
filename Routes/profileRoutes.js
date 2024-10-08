// routes/profileRoutes.js
const express = require('express');
const { updateProfile } = require('../Controllers/profileController');
const ensureAuthenticated = require('../Middlewares/Auth');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

// Route to update user profile
router.put('/update-profile', ensureAuthenticated, upload.single('avatar'), updateProfile);

module.exports = router;
