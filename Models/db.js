// IP:223.178.210.255

// username: fullstackdeveloper0702
// Password : hIvwhNLEvvGA9oZd

const mongoose = require('mongoose');

const mongo_url = process.env.MONGO_CONN;

mongoose.connect(mongo_url,)
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });
