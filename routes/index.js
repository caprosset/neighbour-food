const express = require('express');
const router = express.Router();

// Routers
const authRouter = require('./auth/auth');
const loginRouter = require('./auth/login');
const signoutRouter = require('./auth/signout');
const signupRouter = require('./auth/signup');



// * '/auth'
router.use('/auth', authRouter);

// * '/login'
router.use('/login', loginRouter);

// * '/signout'
router.use('/signout', signoutRouter);

// * '/signup'
router.use('/signup', signupRouter);


/* GET home page */
router.get('/', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/meal-events');
  } else {
    res.render('index');
  }
}); 

router.get('/search', (req, res, next) => {
  console.log('req.query ->', req.query);
  res.send(req.query);
}); 

module.exports = router;