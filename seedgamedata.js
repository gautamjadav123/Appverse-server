// seedGames.js
const mongoose = require('mongoose');
require('dotenv').config();
const Game = require('./Models/Game'); // Adjust the path if necessary

// Connect to MongoDB
mongoose.connect(process.env.MONGO_CONN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB for seeding'))
.catch((error) => console.error('MongoDB connection error:', error));

// Single game data without reviews, ratings, or totalReviews
const gameData = {
  name: 'Infinity Ops: Cyberpunk FPS',
  developer: 'Azur Interactive Games Limited',
  version: '2.0.1',
  size: '2.6 GB',
  recommendedAge: 'Rated 16+',
  imageUrl: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730884076/image_4_qc7rsm.png',
  screenshots: [
    'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730883706/image_glqzqz.png',
    'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730883706/image_1_yvcnaf.png',
    'https://res.cloudinary.com/djgvrpf4x/video/upload/v1730958744/-2dc9-4575-8057-10f839424ce9_u0deta.mp4'
  ],
  availableOn: ['PC', 'Mobile'],
  description: 'Infinity Ops A multiplayer FPS in a sci-fi and CYBERPUNK setting! The event of the game take place in the distant future, when humanity has surpassed the limits of technological development and the world has descended into the chaos of interplanetary warfare!',
  dataSecurity: 'Safety starts with understanding how developers collect and share your data. Data privacy and security practices may vary based on your use, region, and age.  This app may share these data types with third parties Location, Personal info and 4 others  This app may collect these data types Personal info, Financial info and 3 others',
  similarGames: [
    {
      name: 'Shadow Fight 2',
      rating: 4.5,
      price: 'Free',
      imageUrl: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730883706/image_2_xbnwew.png',
      installLink: 'https://play.google.com/store/apps/details?id=com.nekki.shadowfight'
    },
    {
      name: 'War Sniper',
      rating: 4.4,
      price: 'Free',
      imageUrl: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730883705/Rectangle_88_ggp7do.png',
      installLink: 'https://play.google.com/store/apps/details?id=com.war.sniper'
    },
    {
        name: 'Car Racing 3D',
        rating: 4.3,
        price: 'Free',
        imageUrl: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730883705/Rectangle_89_d9qf4v.png',
        installLink: 'https://play.google.com/store/apps/details?id=com.racergame.cityracing3d&hl=en-US'
    },
    {
        name: 'Angry Birds 2',
        rating: 4.2,
        price: 'Free',
        imageUrl: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730883705/image_3_upc3hx.png',
        installLink: 'https://play.google.com/store/apps/details?id=com.rovio.baba&hl=en-US'
    }

  ]
};

// Insert the single game document without initial reviews, ratings, or totalReviews
Game.create(gameData)
  .then(() => {
    console.log('Single game data seeded successfully without initial reviews, ratings, or totalReviews');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error seeding game data:', error);
    mongoose.connection.close();
  });
