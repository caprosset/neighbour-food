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
  res.render('index');
}); 


module.exports = router;