const express = require('express');
const router = express.Router();

// GET '/login' -- renders the Login form
router.get('/', (req, res, next) => {
  res.render('auth-views/login');
});

module.exports = router;