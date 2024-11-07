// seed.js
const mongoose = require('mongoose');
const App = require('./Models/GameApp');
require('dotenv').config();

mongoose.connect(process.env.MONGO_CONN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const apps = [
  // Top Picks on PC
  {
    name: 'Exorcist: Fear of Phasmophobia',
    rating: 4.5,
    price: 'Free',
    imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265447/image_lw7ies.png',
        'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265446/image2_y9t1kg.png'
    ],
    installLink: 'https://play.google.com/store/apps/details?id=com.apogames.phasmophobia&hl=en-US',
    category: 'Horror',
    type: 'top-pick-pc',
  },
  {
    name: 'Chess',
    rating: 4.6,
    price: 'Free',
    imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265533/chess_dca6at.png',
        'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265531/chess2_xk29wg.png'
    ],
    installLink: 'https://play.google.com/store/apps/details?id=com.jetstartgames.chess&hl=en-US',
    category: 'Strategy',
    type: 'top-pick-pc',
  },

  {
    name: 'Super Adventure of Jabber',
    rating: 4.3,
    price: 'Free',
    imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265730/super_jabbar_qwmey2.png',
        'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265729/supper_jabbar_2_d5cljf.png'
    ],
    installLink: 'https://play.google.com/store/apps/details?id=com.gameone.superadventuresofjabber.free&hl=en-US',
    category: 'Adventure',
    type: 'top-pick-pc',
  },

  {
    name: 'Infinity Ops: Cyberpunk FPS',
    rating: 4.4,
    price: 'Free',
    imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265929/infinity_ops_er5eua.png',
        'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265928/infinity_ops_2_fyot8p.png'
    ],
    installLink: 'https://play.google.com/store/apps/details?id=com.gamedevltd.destinywarfare&hl=en-US',
    category: 'Action',
    type: 'top-pick-pc',
  },

  {
    name: 'Avatar World',
    rating: 4.7,
    price: 'Free',
    imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266044/avatar_World_gl35mi.png',
        'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266043/avatar_world_2_udrtaf.png'


    ],
    installLink: 'https://play.google.com/store/apps/details?id=com.pazugames.avatarworld&hl=en-US',
    category: 'Adventure',
    type: 'favorite-pc',
  },
  {
    name: 'PK XD: Fun, friends & games',
    rating: 4.5,
    price: 'Free',
    imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266180/pk_xd_wyouku.png',
    'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266180/pk_xd_2_c45riu.png'],
    installLink: 'https://play.google.com/store/apps/details?id=com.movile.playkids.pkxd&hl=en-US',
    category: 'Casual',
    type: 'favorite-pc',
  },


  {
    name: 'MARVEL Future Fight',
    rating: 4.2,
    price: 'Free',
    imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266302/MARVEL_zcyfgn.png',
    'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266301/MARVEL_2_qyuk0n.png'],
    installLink: 'https://play.google.com/store/apps/details?id=com.netmarble.mherosgb&hl=en-us',
    category: 'Action',
    type: 'favorite-pc',
  },


  {
    name: 'Drift Max Pro Car Racing Game',
    rating: 4.5,
    price: 'Free',
    imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266432/DRIFT_MAX_qdrt5m.png',
    'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730266431/DRIFT_MAX_2_f7eehu.png'],
    installLink: 'https://play.google.com/store/apps/details?id=com.tiramisu.driftmax2&hl=en-US',
    category: 'Racing',
    type: 'favorite-pc',
  },



  {
    name: 'Exorcist: Fear of Phasmophobia',
    rating: 4.5,
    price: 'Free',
    imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265447/image_lw7ies.png',
        'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265446/image2_y9t1kg.png'
    ],
    installLink: 'https://play.google.com/store/apps/details?id=com.apogames.phasmophobia&hl=en-US',
    category: 'Horror',
    type: 'vr-game',
  },
  {
    name: 'Chess',
    rating: 4.6,
    price: 'Free',
    imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265533/chess_dca6at.png',
        'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265531/chess2_xk29wg.png'
    ],
    installLink: 'https://play.google.com/store/apps/details?id=com.jetstartgames.chess&hl=en-US',
    category: 'Strategy',
    type: 'vr-game',
  },

  {
    name: 'Super Adventure of Jabber',
    rating: 4.3,
    price: 'Free',
    imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265730/super_jabbar_qwmey2.png',
        'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265729/supper_jabbar_2_d5cljf.png'
    ],
    installLink: 'https://play.google.com/store/apps/details?id=com.gameone.superadventuresofjabber.free&hl=en-US',
    category: 'Adventure',
    type: 'vr-game',
  },

  {
    name: 'Infinity Ops: Cyberpunk FPS',
    rating: 4.4,
    price: 'Free',
    imageUrls: ['https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265929/infinity_ops_er5eua.png',
        'https://res.cloudinary.com/djgvrpf4x/image/upload/v1730265928/infinity_ops_2_fyot8p.png'
    ],
    installLink: 'https://play.google.com/store/apps/details?id=com.gamedevltd.destinywarfare&hl=en-US',
    category: 'Action',
    type: 'vr-game',
  },


];

App.insertMany(apps)
  .then(() => {
    console.log('Data seeded');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Seeding error:', error);
    mongoose.connection.close();
  });
