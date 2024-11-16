// seedVRGames.js
const mongoose = require('mongoose');
require('dotenv').config();
const VRGame = require('./Models/VRGame'); // Adjust the path if necessary

// Connect to MongoDB
mongoose.connect(process.env.MONGO_CONN || 'mongodb+srv://fullstackdeveloper0702:hIvwhNLEvvGA9oZd@cluster0.fr9yhxd.mongodb.net/Cluster0?retryWrites=true&w=majority' , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB for seeding VR Games'))
.catch((error) => console.error('MongoDB connection error:', error));

// Sample VR games data
const vrGamesData = [
    {
        name: 'Exorcist: Fear of Phasmophobia',
        rating: 4.5,
        price: 'Free',
        imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265447/image_lw7ies.png',
            'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265446/image2_y9t1kg.png'
        ],
        installLink: 'https://play.google.com/store/apps/details?id=com.apogames.phasmophobia&hl=en-US',
        category: 'Horror'
      
      },
      {
        name: 'Chess 3D',
        rating: 4.6,
        price: 'Free',
        imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265533/chess_dca6at.png',
            'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265531/chess2_xk29wg.png'
        ],
        installLink: 'https://play.google.com/store/apps/details?id=com.jetstartgames.chess&hl=en-US',
        category: 'Strategy'
       
      },
    
      {
        name: 'Super Adventure of Jabber',
        rating: 4.3,
        price: 'Free',
        imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265730/super_jabbar_qwmey2.png',
            'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265729/supper_jabbar_2_d5cljf.png'
        ],
        installLink: 'https://play.google.com/store/apps/details?id=com.gameone.superadventuresofjabber.free&hl=en-US',
        category: 'Adventure'
      
      },
    
      {
        name: 'Infinity Ops: Cyberpunk FPS',
        rating: 4.4,
        price: 'Free',
        imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265929/infinity_ops_er5eua.png',
            'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265928/infinity_ops_2_fyot8p.png'
        ],
        installLink: 'https://play.google.com/store/apps/details?id=com.gamedevltd.destinywarfare&hl=en-US',
        category: 'Action'
        
      },


      {
        name: 'Avatar World',
        rating: 4.7,
        price: 'Free',
        imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266044/avatar_World_gl35mi.png',
            'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266043/avatar_world_2_udrtaf.png'
    
    
        ],
        installLink: 'https://play.google.com/store/apps/details?id=com.pazugames.avatarworld&hl=en-US',
        category: 'Adventure'
       
      },
      {
        name: 'PK XD: Fun, friends & games',
        rating: 4.5,
        price: 'Free',
        imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266180/pk_xd_wyouku.png',
        'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266180/pk_xd_2_c45riu.png'],
        installLink: 'https://play.google.com/store/apps/details?id=com.movile.playkids.pkxd&hl=en-US',
        category: 'Casual'
       
      },
    
    
      {
        name: 'MARVEL Future Fight',
        rating: 4.2,
        price: 'Free',
        imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266302/MARVEL_zcyfgn.png',
        'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266301/MARVEL_2_qyuk0n.png'],
        installLink: 'https://play.google.com/store/apps/details?id=com.netmarble.mherosgb&hl=en-us',
        category: 'Action'
       
      },
    
    
      {
        name: 'Drift Max Pro Car Racing Game',
        rating: 4.5,
        price: 'Free',
        imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266432/DRIFT_MAX_qdrt5m.png',
        'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266431/DRIFT_MAX_2_f7eehu.png'],
        installLink: 'https://play.google.com/store/apps/details?id=com.tiramisu.driftmax2&hl=en-US',
        category: 'Racing'
       
      }
  // Add more VR games as needed
];

// Seed the VR games data into the VRGames collection
VRGame.insertMany(vrGamesData)
  .then(() => {
    console.log('VR Games seeded successfully');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error seeding VR Games:', error);
    mongoose.connection.close();
  });
