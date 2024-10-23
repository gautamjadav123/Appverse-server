const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  mediaUrls: { type: [String], required: true },
  installLink: { type: String, required: true },
  reviews: { type: [mongoose.Schema.Types.ObjectId], ref: 'Review' }, 
  
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }]// Reference to reviews
});

const App = mongoose.model('App', appSchema);

module.exports = App;
