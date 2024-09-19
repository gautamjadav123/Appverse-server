const express = require('express');
const passport = require('passport');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const { login, signup, forgotPassword, resetPassword } = require('../Controllers/AuthController');
const router = express.Router();

// Regular signup and login routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPassword);  // Forgot password route
router.post('/reset-password/:token', resetPassword);  // Reset password route



module.exports = router;
