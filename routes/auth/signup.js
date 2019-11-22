const express = require('express');
const router = express.Router();

// GET '/signup' -- renders the sign up form
router.get('/', (req, res, next) => {
  res.render('auth-views/signup');
});

module.exports = router;