const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
require('dotenv').config();
require('./Models/db'); // MongoDB connection setup
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const mediaRoutes = require('./Routes/mediaRoutes');
const userRoutes = require('./Routes/userRoutes');
const profileRoutes = require('./Routes/profileRoutes');
const locationRoutes = require('./Routes/locationRoutes');
const cloudinary = require('cloudinary').v2;
const ensureAuthenticated  = require('./Middlewares/Auth');
const Review = require('./Models/Review'); 
const User=require('./Models/User');
const App = require('./Models/App');// Adjust the path according to your project structure


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware setup
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: true,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Utility function to generate random ratings
const generateRandomRating = () => {
  return (Math.random() * (5 - 1) + 1).toFixed(1);  // Generates a random rating between 1 and 5
};


const apps = {
  newReleased: [
    {name:'zomato', icon: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727203284/zomato.png' },
    {name:'snapchat', icon: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727458589/image_45_ba5eoa.png' },
    {name:'phonepe',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727458590/image_46_lqdyhz.png'},
    {name:'Whatsapp',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727458589/image_47_w1ddzf.png'},
    {name:'amazon prime video',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727458589/image_48_smkpek.png'},
    {name:'MCDONALDS',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727458589/Group_7_sfr297.png'},
    {name:'Netflix',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727286214/netflix.png'},
    {name:'INDIGO FLIGHT Booking app',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727458591/image_50_xjgvm8.png'},
    {name:'adobe',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727458591/image_54_qicxrz.png'},
    {name:'Github',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727458590/image_51_otytnv.png'},
    {name:'Skype',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727458590/image_53_jcep3c.png'},
    
  ],
  popularGames: [
    {name:'Roblox', icon: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727458591/Rectangle_24_pr2f3p.png' },
    {name:'Candy Crush', icon: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727458590/Rectangle_39_su0ak7.png' },
    {name:'Fortnite',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727458590/Rectangle_38_h7zwvo.png'},
    {name:'Pubg Mobile',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1728282733/Rectangle4.0eb8b96ad81a7b30f0c9_dpv2rb.png'},
    {name:'MineCraft',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727517320/push-advertising-abstract-concept-vector-illustration_1_xk3smj.png'},
    {name:'Clash of Clans',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727517318/Rectangle6.935140eef65ec08b56ae_v2ziam.png'},
    {name:'Among Us',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727517320/Rectangle7.d36e8f11b03117a23c20_pb295p.png'},
    {name:'Call Of Duty:infinite Warfare',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727517317/Rectangle8.5f242760e38ee1e3eb61_kxagrr.png'},
    {name:'Subway Sufers',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727517319/Rectangle9.35b119c3b50c05b1a8fc_oxcod1.png'}

  ],
  trendingApps: [
    { name: 'Discord', icon: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727517310/download_u8thc7.png' },
    { name: 'Thriller', icon: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727517310/download_1_foxwqu.png' },
    {name:'Venmo',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1728283254/download_betfrl.png'},
    {name:'Notion',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727517310/download_2_rtcr22.png'}
  ],
  musicApps: [
    { name:'Spotify', icon: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727260494/spotify.png'},
    { name:'Musicxmatch', icon: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727257638/musicxmatch.png' },
    {name:'Amazon Music',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1728284137/amazon_prime_uivvus.png'},
    {name:'Sound Cloud',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1728284137/soundCloud_pkkwpn.png'},
    {name:'Pandora',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1728284137/Pandora_yiyx2x.png'},
    {name:'Jio Saavan',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1728284137/Jio_Saavan_cgainr.png'},
    {name:'iHeartRadio',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1728284137/iHeartRadio_r4juui.png'},
    {name:'JangoRadio',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1728284137/JangoRadio_i54nev.png'},
    {name:'MixCloud',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1728284137/MixCloud_qsfh6n.png'},
    {name:'Shazam',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1728284137/Shazam_alrtej.png'},
    {name:'Musicxmatch',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1728284137/Musixmatch_qjr7ug.png'},



  ],

  releasedSoon: [
    { name:'Counter Strike ',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1728293776/now_avll_am0ipg.png' }, // Replace with actual Cloudinary public ID
    { name:'Ghenshin impact',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1728293774/now_avl_xuywdw.png' } // Replace with actual Cloudinary public ID
  ],
  availableNow: [
    { name:'Phasmophobia',icon:'https://res.cloudinary.com/djgvrpf4x/image/upload/v1728293764/realeasing_soon_o7vbuj.png'} // Replace with actual Cloudinary public ID
     // Replace with actual Cloudinary public ID
  ]

};

const getAppData = (category) => {
  return apps[category].map(app => ({
    name: app.name,
    icon: cloudinary.url(app.icon), // Get the Cloudinary URL for the icon
    rating: generateRandomRating(), // Assign a random rating
  }));
};








// Get app details by name
app.get('/api/appsdata/:appName', async (req, res) => {
  const { appName } = req.params;
  try {
    const app = await App.findOne({ name: appName.toLowerCase() });
    if (app) {
      res.status(200).json(app);
    } else {
      res.status(404).json({ message: 'App not found' });
    }
  } catch (err) {
    console.error('Error fetching app data:', err);
    res.status(500).json({ message: 'Error fetching app data' });
  }
});



// POST: Add review for a specific app
// Route to add a review to an app




app.get('/api/appsdata/:appName/reviews', async (req, res) => {
  const { appName } = req.params;

  try {
    // Verify that the appName exists in the appsdata collection
    const app = await App.findOne({ name: appName.toLowerCase() });

    if (!app) {
      return res.status(404).json({ message: 'App not found in database' });
    }

    // If appName is valid, proceed to fetch the reviews
    const reviews = await Review.find({ appId: appName.toLowerCase() });
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

    res.status(200).json({
      reviews: reviews.map(review => ({
        rating: review.rating,
        title: review.title,
        description: review.description,
        userId: review.userId,
        username: review.username,
        avatarUrl: review.avatarUrl,
        createdAt: review.createdAt,
      })),
      averageRating,
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});



    // Fetch reviews for the app from the database



    app.post('/api/appsdata/:appName/review', ensureAuthenticated, async (req, res) => {
      const { appName } = req.params;
      const { rating, title, description } = req.body;
    
      if (!rating || rating < 1 || rating > 5 || !description) {
        return res.status(400).json({ message: 'Rating between 1-5 and description are required' });
      }
    
      try {
        // Verify that the appName exists in the appsdata collection
        const app = await App.findOne({ name: appName.toLowerCase() });
    
        if (!app) {
          return res.status(404).json({ message: 'App not found in database' });
        }
    
        // If appName is valid, proceed to add the review
        const userId = req.user._id;
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        const newReview = {
          appId: appName.toLowerCase(),
          rating: parseFloat(rating),
          title: title || '',
          description,
          userId: user._id,
          username: user.name,
          avatarUrl: user.avatarUrl || '',
          createdAt: new Date(),
        };
    
        // Save the review in the database
        await Review.create(newReview);
    
        // Fetch all reviews to recalculate the average rating
        const reviews = await Review.find({ appId: appName.toLowerCase() });
        const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRatings / reviews.length).toFixed(1);
    
        res.status(201).json({
          message: 'Review added successfully',
          averageRating,
          reviews: reviews.map(review => ({
            rating: review.rating,
            title: review.title,
            description: review.description,
            userId: review.userId,
            username: review.username,
            avatarUrl: review.avatarUrl,
            createdAt: review.createdAt,
          })),
        });
      } catch (err) {
        console.error('Error adding review:', err);
        res.status(500).json({ message: 'Error adding review' });
      }
    });
    




// Helper function to fetch app data and generate random ratings


// Routes setup
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/appdetails', mediaRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/user', userRoutes);
app.use('/api/location', locationRoutes); 


app.get('/api/apps/new-released', (req, res) => {
  res.json(getAppData('newReleased'));
});

// Popular Games
app.get('/api/apps/popular-games', (req, res) => {
  res.json(getAppData('popularGames'));
});

// Trending Apps
app.get('/api/apps/trending-apps', (req, res) => {
  res.json(getAppData('trendingApps'));
});

// Music Apps
app.get('/api/apps/music-apps', (req, res) => {
  res.json(getAppData('musicApps'));
});


app.get('/api/apps/upcoming-and-available', async (req, res) => {
  try {
    // Map over each category to add Cloudinary URLs for icons
    const releasedSoonApps = apps.releasedSoon.map(app => ({
      name: app.name,
      icon: cloudinary.url(app.icon), // Updated to use cloudinary.url
    }));

    const availableNowApps = apps.availableNow.map(app => ({
      name: app.name,
      icon: cloudinary.url(app.icon), // Updated to use cloudinary.url
    }));

    // Respond with both categories of apps
    res.json({
      releasedSoon: releasedSoonApps,
      availableNow: availableNowApps
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Cloudinary Media Route
app.get('/api/media', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 80, // Adjust as needed
    });
    res.json(result.resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Log all routes for debugging
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`Route: ${r.route.path}`);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


