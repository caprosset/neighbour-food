const express = require('express');
const router = express.Router();


// GET '/meal-events' -- renders all the events
router.get('/', (req, res, next) => {
    res.render('meal-views/show-all');
  });
  


module.exports = router;