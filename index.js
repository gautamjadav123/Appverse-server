const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./Models/db'); // MongoDB connection setup
const passport = require('passport');
const session = require('express-session');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const cloudinary = require('./Models/cloudinaryConfig'); // Cloudinary config

  // Google OAuth Passport config

const PORT = process.env.PORT || 8080;


// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Session middleware
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes setup
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

// Cloudinary Media Route
app.get('/', (req, res) => {
  res.send('HOME PAGE');
});

app.get('/api/media', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 50, // Adjust as needed
    });
    res.json(result.resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
