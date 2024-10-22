const mongoose = require('mongoose');
const App = require('./Models/App');
require('dotenv').config(); // For using the .env file

const appsData = [
  {
    name: 'zomato',
    icon: 'https://res.cloudinary.com/djgvrpf4x/image/upload/v1727203284/zomato.png',
    description: 'Zomato is a comprehensive food discovery and restaurant review app...',
    mediaUrls: [
      'https://res.cloudinary.com/dzozq5wsi/image/upload/v1727202383/Group_119923_lle4wh.png',
      'https://res.cloudinary.com/dzozq5wsi/image/upload/v1727202282/Group_119922_edatce.png',
      'https://res.cloudinary.com/dzozq5wsi/image/upload/v1727202227/Group_119924_fwb6zh.png',
      'https://res.cloudinary.com/dzozq5wsi/image/upload/v1727202227/Group_119925_kquodp.png',
    ],
    installLink: 'https://play.google.com/store/apps/details?id=com.application.zomato&hl=en-US'
  },
  // Add more apps here if needed...
];

async function insertAppsData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_CONN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Insert the apps data
    await App.insertMany(appsData);
    console.log('Apps data inserted successfully');

    // Close the connection
    mongoose.connection.close();
  } catch (err) {
    console.error('Error inserting apps data:', err);
  }
}

insertAppsData();
