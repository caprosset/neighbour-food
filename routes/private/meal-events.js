const express = require('express');
const router = express.Router();

const MealEvent = require('../../models/MealEvent');
const User = require('../../models/User');


// GET '/meal-events' -- renders all the events
router.get('/', (req, res, next) => {

  MealEvent.find()
  .then( (allMealEventsFromDB) => {
      console.log(allMealEventsFromDB)
      res.render('meal-views/show-all', { allMealEventsFromDB , userInfo: req.session.currentUser});
  })
  .catch( (err) => console.log(err));
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
  host: req.session.currentUser._id,
  guest: [],
  eventDescription:req.body.eventDescription ,
  numberAttend: req.body.numberAttend,
  costScore: 10
  });

  console.log('HEREEEEEE', theMealEvent);

  theMealEvent.save()
  .then( mealevent => {
    console.log('MEAL EVENT', mealevent);
    console.log('SAVE HOSTED EVENT IN USER')
    console.log('MEAL EVENT ID', mealevent._id);
    console.log('USER ID', req.session.currentUser._id);

    User.updateOne({ _id: req.session.currentUser._id }, { $addToSet: { hostedEvents: mealevent._id} }, {new: true})
    // User.find({ email: 'capcap@cap'})
    .then( (data) => console.log('USER FOUND', data))
    .catch( (err) => console.log(err))
  })
  .then( () => { 
    res.redirect('/meal-events'); 
  })
  .catch( (err) => {
    console.log(err);
    res.render('meal-views/create');
  });
  
});

// GET	/meal-events/:id	Private route. Renders the meal-views/show view.
router.get('/:id', (req, res, next) => {
  MealEvent.findOne({ _id: req.params.id }, (err, theMealEvent) => {
    if (err) {
      return next(err);
    }
    User.find({_id: theMealEvent.host})
    .then( hostInfo => {
      res.render('meal-views/show', {mealEvent: theMealEvent, hostInfo});
    })
  });
});

// // GET	/meal-events/:id/edit	Private route. Renders the meal-views/edit form view.
router.get('/:id/edit', (req, res, next) => {
  MealEvent.findOne({ _id: req.params.id }, (err, theMealEvent) => {
    if (err) {
      return next(err);
    }

    res.render('meal-views/edit', {
      mealEvent: theMealEvent,
    });
  });
});

// // PUT	/meal-events/:id/edit	Private route. Updates the existing event from the current user in the DB. Redirects to the user-views/myevents view.
router.post('/:id', function(req, res, next) {
  const updatedEvent = {
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
  };
  MealEvent.update(
    { _id: req.params.id },
    updatedEvent,
    (err, theMealEvent) => {
      if (err) {
        return next(err);
      }

      res.redirect('/meal-events');
    },
  );
});

router.post('/:id/addguest', function(req, res, next) {
  const id = req.params.id;
  const updatedEvent = { guest: req.session.currentUser._id };

  const pr1 = MealEvent.update(
    { _id: req.params.id },
    updatedEvent,
    (err) => { if (err) { return next(err); }},
  );

  const pr2 = User.update(
    { _id: req.session.currentUser._id},
    { $addToSet: { attendedEvents: id} },
    (err) => { if (err) { return next(err); }},
  )

  Promise.all([pr1, pr2])
  .then( () => res.redirect('/meal-events'))
  .catch( (err) => console.log(err));    
});

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