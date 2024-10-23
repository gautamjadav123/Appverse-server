const mongoose = require('mongoose');
const App = require('./Models/App');
require('dotenv').config();

// MongoDB connection (replace with your actual connection string)
mongoose.connect(process.env.MONGO_CONN, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("MongoDB Connected...");

    try {
      // Find the app by name
      const app = await App.findOne({ name: 'zomato' });

      if (!app) {
        console.log('App not found');
        return;
      }

      // Insert FAQs
      app.faqs.push(
        {
          question: 'Can I order food for delivery from any restaurant?',
          answer: 'You can order food for delivery from any restaurant that offers delivery services through Zomato.'
        },
        {
          question: 'What is Zomato Gold?',
          answer: 'Zomato Gold is a membership program that offers exclusive discounts and benefits at partner restaurants.'
        }
      );

      // Save the app with new FAQs
      await app.save();
      console.log('FAQs inserted successfully', app.faqs);
    } catch (err) {
      console.error('Error inserting FAQs:', err);
    } finally {
      mongoose.connection.close(); // Close the connection
    }
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
  });
