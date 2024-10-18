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
const User=require('./Models/User');// Adjust the path according to your project structure


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
    { name:'zomato', icon: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727203284/zomato.png' },
    { name:'snapchat', icon: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727458589/image_45_ba5eoa.png' },
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


//appsdata 

let appsData = [
  {
    id: 1,
    name: 'zomato',
    icon: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727203284/zomato.png',
    description: 'Zomato is a comprehensive food discovery and restaurant review app designed to help users find and explore dining options. It features detailed restaurant listings, user reviews, menus, and photos to assist in making informed dining choices. Zomato also offers features for online food ordering and table reservations, making it a versatile tool for food enthusiasts and those seeking convenient dining solutions.',
    mediaUrls: [
      'https://res.cloudinary.com/dzozq5wsi/image/upload/v1727202383/Group_119923_lle4wh.png',
      'https://res.cloudinary.com/dzozq5wsi/image/upload/v1727202282/Group_119922_edatce.png',
      'https://res.cloudinary.com/dzozq5wsi/image/upload/v1727202227/Group_119924_fwb6zh.png',
      'https://res.cloudinary.com/dzozq5wsi/image/upload/v1727202227/Group_119925_kquodp.png',
    ],
    reviews: [], // Stores user reviews with rating, title, description
    installLink: 'https://play.google.com/store/apps/details?id=com.application.zomato&hl=en-US',
    rating: 0, // Average rating initially
  },
  // Add more apps similarly...
];


// Get app details by name
app.get('/api/apps/:appName', (req, res) => {
  const { appName } = req.params;
  const app = appsData.find(app => app.name.toLowerCase() === appName.toLowerCase());

  if (app) {
    res.status(200).json(app);
  } else {
    res.status(404).json({ message: 'App not found' });
  }
});



// POST: Add review for a specific app
// Route to add a review to an app
app.post('/api/apps/:appName/review', ensureAuthenticated, async (req, res) => {
  const { appName } = req.params;
  const { rating, title, description } = req.body;

  // Check for rating and description (title is optional)
  if (!rating || rating < 1 || rating > 5 || !description) {
      return res.status(400).json({ message: 'Rating between 1-5 and description are required' });
  }

  // Find the app by its name
  const app = appsData.find(app => app.name.toLowerCase() === appName.toLowerCase());

  if (app) {
      try {
          const userId = req.user.id; // User ID from token
          const user = await User.findById(userId); // Fetch user details from the database

          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }

          // Create a new review object
          const newReview = new Review({
              appId: appName,
              rating: parseFloat(rating),
              title: title || '',
              description,
              userId: user._id,
              username: user.name,
              avatarUrl: user.avatarUrl || '',
          });

          // Save the review to the database
          await newReview.save();

          // Optionally, update the in-memory app's review list if you want to keep it updated
          // This is where duplication can happen
          app.reviews.push(newReview); // Only do this if you need the in-memory update
          
          // Recalculate average rating
          const totalRatings = app.reviews.reduce((sum, review) => sum + review.rating, 0);
          app.rating = (totalRatings / app.reviews.length).toFixed(1);

          // Prepare the response to include the reviews (use the database or in-memory as needed)
          const updatedAppResponse = {
              ...app,
              reviews: app.reviews, // Only include the in-memory reviews (or fetch them from the database)
          };

          res.status(201).json({ message: 'Review added successfully', app: updatedAppResponse });
      } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Error retrieving user information' });
      }
  } else {
      res.status(404).json({ message: 'App not found' });
  }
});




app.get('/api/apps/:appName/reviews', async (req, res) => {
  const { appName } = req.params;

  // Find the app in memory
  const app = appsData.find(app => app.name.toLowerCase() === appName.toLowerCase());

  if (app) {
    try {
      // Fetch all reviews from the database for the app
      const reviews = await Review.find({ appId: appName.toLowerCase() });

      // Return the app info along with the reviews
      res.status(200).json({
        ...app,
       
        reviews: reviews.map(review => ({
          rating: review.rating,
          title: review.title,
          description: review.description,
          userId: review.userId,
          username: review.username,
          avatarUrl: review.avatarUrl,
          createdAt: review.createdAt
        }))
      });
    } catch (err) {
      console.error('Error fetching reviews:', err);
      res.status(500).json({ message: 'Error fetching reviews' });
    }
  } else {
    res.status(404).json({ message: 'App not found' });
  }
});










































































// Helper function to fetch app data and generate random ratings
const getAppData = (category) => {
  return apps[category].map(app => ({
    name: app.name,
    icon: cloudinary.url(app.icon), // Get the Cloudinary URL for the icon
    rating: generateRandomRating(), // Assign a random rating
  }));
};

// Routes setup
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/appdetails', mediaRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/user', userRoutes);
app.use('/api/location', locationRoutes); // For country, state, and city routes

// API Endpoints for categorized apps

// New Released Apps
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
