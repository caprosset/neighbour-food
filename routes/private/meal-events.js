const express = require('express');
const router = express.Router();

const MealEvent = require('../../models/MealEvent');
const User = require('../../models/User');

const parser = require('../../config/cloudinary');

require('dotenv').config();


// Set Current User
let currentUser;
router.use((req, res, next) => {
  if (req.session.currentUser) { // If there is a session
    currentUser = req.session.currentUser;
    next();
  }
})


// GET /meal-events --> renders all the events
router.get('/', (req, res, next) => {
  MealEvent.find()
    .populate('host')
    .then((allMealEventsFromDB) => {

      // for each meal event, push user id and zipcode into the meal object
      allMealEventsFromDB.forEach(meal => {
        meal["userZipcode"] = currentUser.address.zipcode;
        meal["userId"] = currentUser._id;
      })

      res.render('meal-views/show-all', {
        allMealEventsFromDB
      });
    })
    .catch((err) => console.log('ERRROOOORRR', err));
});


//  GET /meal-events/create	--> Renders the form view to add a new event
router.get('/create', (req, res, next) => {
  res.render('meal-views/create');
});

// POST	/meal-events/create	--> Adds a new event in the DB 
router.post('/create', parser.single('eventImg'), (req, res, next) => {
  const { eventName, cuisine, dish, date, eventDescription, numberAttend } = req.body

  const theMealEvent = new MealEvent({
    eventName,
    cuisine,
    dish,
    date,
    eventImg: req.file.secure_url,
    host: currentUser._id,
    pendingGuests: [],
    acceptedGuests: [],
    eventDescription,
    numberAttend,
    costScore: 10
  });

  theMealEvent.save()
    .then(mealevent => {
      console.log('MEAL CREATED =>', mealevent)
      return User.updateOne(
        { _id: currentUser._id },
        { $addToSet: { hostedEvents: mealevent._id } },
        { new: true }
      )
    })
    .then((userUpdated) => {
      console.log('USER UPDATED =>', userUpdated)
      res.redirect('/meal-events');
    })
    .catch((err) => {
      console.log(err);
      res.render('meal-views/create');
    });
});


// GET	/meal-events/:id --> Renders the meal event details page
router.get('/:id', (req, res, next) => {
  // pass an error message if user has not enough forks
  const { error } = req.query;
  const errorMessage = error ? "You don't have enough forks to attend this event! Create one and earn 10 forks per guest" : undefined;

  MealEvent.findOne({ _id: req.params.id})
  .populate('host pendingGuests acceptedGuests')
  .then((theMealEvent) => {
    let type = {};

    theMealEvent.acceptedGuests.forEach(guest => {
      console.log('ACCEPTED GUEST IDSSS', guest._id);
      if (guest._id.equals(currentUser._id)) {
        type.accepted = true;
      }
    })

    theMealEvent.pendingGuests.forEach(guest => {
      console.log('PENDING GUEST IDSSS', guest._id);
      if (guest._id.equals(currentUser._id)) {
        type.pending = true;
      }
    })

    let hostAddress = theMealEvent.host.address.street + ' ' + theMealEvent.host.address.houseNumber + ', ' + theMealEvent.host.address.zipcode + ' ' + theMealEvent.host.address.city;
    // console.log('HOST ADDRESSS', hostAddress);

    let userAddress = currentUser.address.street + ' ' + currentUser.address.houseNumber + ', ' + currentUser.address.zipcode + ' ' + currentUser.address.city;
    // console.log('USER ADDRESSS', userAddress);

    const userIsHost = theMealEvent.host._id === currentUser._id;

    res.render('meal-views/show', {
      userIsHost,
      mealEvent: theMealEvent,
      type,
      hostAddress,
      userAddress,
      api_key: process.env.MAPS_API_KEY,
      errorMessage
    });
  })
  .catch((err) => next(err));
});


// GET /meal-events/:id/edit --> Renders the form to edit a specific meal event
router.get('/:id/edit', (req, res, next) => {
  MealEvent.findOne({ _id: req.params.id })
    .then(theMealEvent => {
      res.render('meal-views/edit', { mealEvent: theMealEvent });
    })
    .catch((err) => next(err));
});

// PUT	/meal-events/:id/edit --> Updates the meal event in the DB
router.post('/:id', parser.single('eventImg'), (req, res, next) => {
  MealEvent.findById(req.params.id)
  .then(theMealEvent => {
    let previousImg = theMealEvent.eventImg;
    const imgUrl = req.file ? req.file.secure_url : previousImg;

    const { eventName, cuisine, dish, date, eventDescription, numberAttend } = req.body;
    const updatedEvent = { eventName, cuisine, dish, date, eventImg: imgUrl, eventDescription, numberAttend };

    MealEvent.update({ _id: req.params.id }, updatedEvent)
      .then(() => res.redirect(`/meal-events/${req.params.id}`))
      .catch((err) => next(err));
  });
});


// POST /meal-events/:id/attend --> Adds the current user in the meal-event pendingGuests array && in the user pendingEvents array in the DB
router.post('/:id/attend', function (req, res, next) {
  const mealeventId = req.params.id;

  if (currentUser.score >= 10) {
    const pr1 = MealEvent.update(
      { _id: mealeventId },
      { $addToSet: { pendingGuests: currentUser._id } }
    );

    const pr2 = User.update(
      { _id: currentUser._id },
      { $addToSet: { pendingEvents: mealeventId } }
    );

    Promise.all([pr1, pr2])
      .then(() => res.redirect(`/profile/${currentUser._id}/events`))
      .catch((err) => next(err));
  } else {
    res.redirect(`/meal-events/${mealeventId}?error=noforks`);
  }
});


// POST /meal-events/:mealId/accept/:guestId --> Adds the current user in the meal-event acceptedGuests && the meal event in the user attendedEvents array in the DB
router.post('/:mealId/accept/:guestId', (req, res, next) => {
  const mealeventId = req.params.mealId;
  const guestId = req.params.guestId;

  const pr1 = MealEvent.update({ _id: mealeventId },
    {
      $addToSet: { acceptedGuests: guestId },
      $pull: { pendingGuests: guestId }
    })

  const pr2 = User.update({ _id: guestId },
    {
      $addToSet: { attendedEvents: mealeventId },
      $pull: { pendingEvents: mealeventId },
      $inc: { score: -10 }
    })

  const pr3 = User.update({ _id: currentUser._id },
    {
      $inc: { score: 10 }
    })

  Promise.all([pr1, pr2, pr3])
    .then(() => User.findById(currentUser._id))
    .then(updatedUser => {
      req.session.currentUser = updatedUser;
      res.redirect(`/profile/${currentUser._id}/events`)
    })
    .catch((err) => next(err));
})


// POST /meal-events/:mealId/decline/:guestId --> Removes the current user from both the the meal-event pendingGuests array && the user pendingEvents array in the DB 
router.post('/:mealId/decline/:guestId', (req, res, next) => {
  const mealeventId = req.params.mealId;
  const guestId = req.params.guestId;

  console.log('here1');
  const pr1 = MealEvent.update(
    { _id: mealeventId },
    { $pull: { pendingGuests: guestId } })

  console.log('here2')
  const pr2 = User.update(
    { _id: guestId },
    { $pull: { pendingEvents: mealeventId } })

  Promise.all([pr1, pr2])
    .then(() => {
      console.log('here3');
      res.redirect(`/profile/${currentUser._id}/events`)
    })
    .catch((err) => next(err));
})


// POST /meal-events/:id/cancel --> Removes the current user from the meal event guests array in the DB
router.post('/:id/cancel', function (req, res, next) {
  const mealeventId = req.params.id;

  MealEvent.findById({ _id: mealeventId })
    .then(event => {
      console.log('HOST ID', event.host);
      User.update(
        { _id: event.host },
        { $inc: { score: -10 } })
        .then((data) => console.log('UPDATED HOST SCOREEE', data))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));

  const pr1 = MealEvent.update(
    { _id: mealeventId },
    { $pull: { acceptedGuests: currentUser._id } }
  );

  const pr2 = User.update(
    { _id: currentUser._id },
    {
      $pull: { attendedEvents: mealeventId },
      $inc: { score: 10 }
    }
  )

  Promise.all([pr1, pr2])
    .then(() => User.findById(currentUser._id))
    .then(updatedUser => {
      req.session.currentUser = updatedUser;
      res.redirect(`/profile/${currentUser._id}/events`)
    })
    .catch((err) => next(err));
});


// DELETE	/meal-events/:id/delete --> Deletes the meal event in the DB
router.get('/:id/delete', (req, res, next) => {
  MealEvent.findOne({
    _id: req.params.id
  })
    .then((theMealEvent) => theMealEvent.remove())
    .then(() => res.redirect('/meal-events'))
    .catch((err) => next(err));
});


module.exports = router;