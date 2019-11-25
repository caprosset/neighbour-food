const express = require('express');
const router = express.Router();

// GET '/signout' -- renders the logged out index view
router.get('/', (req, res, next) => {
  req.session.destroy( (err) => {
    console.log('YOU HAVE BEEN LOGGED OUT');
    res.redirect('/');
  })
});
  

module.exports = router;