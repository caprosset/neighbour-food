var express = require('express');
var router = express.Router();

const profileRouter = require('./private/users');
const mealRouter = require('./private/meal-events');


// PRE ROUTE MIDDLEWARE - check if user has authenticated cookie
router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } 																//		|
  else {                          	//    |
  	res.redirect("/login");       	//    |
  }                                 //    |
});																	//		|
	// 	 ------------------------------------
    // |
    // V

// * '/profile'
router.use('/profile', profileRouter);

// * '/meal-events'
router.use('/meal-events', mealRouter);


module.exports = router;