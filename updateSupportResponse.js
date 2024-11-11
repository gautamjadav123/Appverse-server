const mongoose = require('mongoose');
const App = require('./Models/App'); // Adjust the path to your App model

// Connect to MongoDB
mongoose.connect('mongodb+srv://fullstackdeveloper0702:hIvwhNLEvvGA9oZd@cluster0.fr9yhxd.mongodb.net/Cluster0?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Function to add or update supportResponse field for all apps
const updateSupportResponse = async () => {
  try {
    const appsData = [
      {
        name: "zomato",
        supportResponse: "For support and assistance, please visit the Help Center in the app or contact us via email at support@zomato.com."
      }
     
      // Add more apps as needed
    ];

    for (let appData of appsData) {
      const { name, supportResponse } = appData;
      // Find the app by name and update only the supportResponse field
      const updatedApp = await App.updateOne(
        { name: name }, 
        { $set: { supportResponse: supportResponse } }
      );

      if (updatedApp.modifiedCount > 0) {
        console.log(`Updated supportResponse for ${name} successfully.`);
      } else {
        console.log(`No app found with name ${name} to update.`);
      }
    }

    mongoose.disconnect(); // Close the connection once done
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error while updating supportResponse:', error);
    mongoose.disconnect();
  }
};

// Execute the function
updateSupportResponse();
