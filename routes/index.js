const express = require('express');
const router = express.Router();

// Routers
const authRouter = require('./auth/auth');
const loginRouter = require('./auth/login');
const signoutRouter = require('./auth/signout');
const signupRouter = require('./auth/signup');

// Models
const MealEvent = require('./../models/MealEvent');


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
  // if user is logged in
  if (req.session.currentUser) {
    res.redirect('/meal-events');
  } 
  else // if user is logged out
  {
    MealEvent.find()
    .populate('host')
    .then( (allMealsFromDB) => {
      res.render('index', { allMealsFromDB });
    })
    .catch( (err) => console.log(err));
  }
}); 


router.get('/search', (req, res, next) => {
  // console.log('req.query ->', req.query);
  const { zipcode: enteredZipcode } = req.query;

  MealEvent.find()
  .populate('host')
  .then( (allMealsFromDB) => {
    // console.log('MEEAAAALSSSS', allMealsFromDB);

    const eventsNearZipcode = allMealsFromDB.filter( oneMeal => {  
      // console.log(oneMeal.host);
      if(oneMeal.host !== null) {
        return oneMeal.host.address.zipcode === enteredZipcode;
      }
    }) 
    // console.log(eventsNearZipcode);
    res.render('index', { eventsNearZipcode });
  })
  .catch( (err) => console.log(err));
}); 



module.exports = router;