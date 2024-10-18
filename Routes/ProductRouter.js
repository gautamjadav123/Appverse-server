const ensureAuthenticated = require('../Middlewares');

const router = require('express').Router();

router.get('/',ensureAuthenticated,(req,res)=>{
    console.log('____ Logged in User Detail_________',req.user);
    res.status(200).json([
        {
            app:"youtube",
            stars:'5'
        },
        {
            app:"whatsapp",
            stars:'4'
        }
    ])
});



module.exports = router;

