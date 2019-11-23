const express = require('express');
const router = express.Router();



const MealEvent = require('../../models/MealEvent');


// GET '/meal-events' -- renders all the events
router.get('/', (req, res, next) => {
  MealEvent.find({}, (err, mealEventsArray) => {
    if(err) {
      return next(err);
    }
    console.log(mealEventsArray);
    res.render('meal-views/show-all', {
      mealEvents: mealEventsArray,
    });
  });
  });
  

//   GET	/meal-events/create	Private route. Renders the meal-views/create form view to add a new event for the current user.
router.get('/create', (req, res, next) => {
  res.render('meal-views/create')
  });

// POST	/meal-events/create	Private route. Adds a new event for the current user. Redirects to the meal-views/show-all view (url: /meal-events).
router.post('/create', (req, res, next) => {
  const theMealEvent = new MealEvent({
  eventName: req.body.eventName,
  cuisine: req.body.cuisine ,
  dish: req.body.dish ,
  date: req.body.date ,
  eventImg: req.body.eventImg ,
  // host: {  type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  // guest: [{  type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  eventDescription:req.body.eventDescription ,
  numberAttend: req.body.numberAttend,
  // costScore: req.body.
  });
  theMealEvent.save(err => {
    if (err) {
      res.render('meal-views/create');
    } else {
      res.redirect('/meal-events');
    }
  })
});

// GET	/meal-events/:id	Private route. Renders the meal-views/show view.
router.get('/:id', (req, res, next) => {
  MealEvent.findOne({ _id: req.params.id }, (err, theMealEvent) => {
    if (err) {
      return next(err);
    }

    res.render('meal-views/show', {
      title: `${theMealEvent.eventName} Details`,
      mealEvent: theMealEvent,
    });
  });
});

// // GET	/meal-events/:id/edit	Private route. Renders the meal-views/edit form view.
router.get('/:id/edit', (req, res, next) => {
  MealEvent.findOne({ _id: req.params.id }, (err, theMealEvent) => {
    if (err) {
      return next(err);
    }

    res.render('meal-views/edit', {
      title: `Edit ${theMealEvent.eventName}`,
      mealEvent: theMealEvent,
    });
  });
});

// // PUT	/meal-events/:id/edit	Private route. Updates the existing event from the current user in the DB. Redirects to the user-views/myevents view.



// // DELETE	/meal-events/:id/delete
router.get('/:id/delete', (req, res, next) => {
  console.log('DELETE', req.params);

  MealEvent.findOne({ _id: req.params.id }, (err, theMealEvent) => {
    if (err) {
      return next(err);
    }

    theMealEvent.remove(err => {
      if (err) {
        return next(err);
      }

      res.redirect('/meal-events');
    });
  });
});


module.exports = router;