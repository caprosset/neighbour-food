const express = require('express');
const router = express.Router();

const MealEvent = require('../../models/MealEvent');
const User = require('../../models/User');

const parser = require('../../config/cloudinary');


// GET /meal-events --> renders all the events
router.get('/', (req, res, next) => {
  MealEvent.find()
    .populate('host')
    .then((allMealEventsFromDB) => {
      // console.log('ALL EVENTS', allMealEventsFromDB)

      // for each meal event, push userinfo zipcode in the object
      allMealEventsFromDB.forEach(meal => {
        meal["userZipcode"] = req.session.currentUser.address.zipcode;
        meal["userId"] = req.session.currentUser._id;
      })
      // console.log('USERS ZIPCODE', allMealEventsFromDB[0].userZipcode)
      console.log('USERS ID', allMealEventsFromDB[0].userId)

      res.render('meal-views/show-all', {
        allMealEventsFromDB,
        userInfo: req.session.currentUser
      });
    })
    .catch((err) => console.log('ERRROOOORRR', err));
});


//  GET /meal-events/create	--> Renders the form view to add a new event
router.get('/create', (req, res, next) => {
  res.render('meal-views/create', {
    userInfo: req.session.currentUser
  });
});

// POST	/meal-events/create	--> Adds a new event in the DB 
router.post('/create', parser.single('eventImg'), (req, res, next) => {
  // const image_url = req.file.secure_url

  // function convertDate(str) {
  //   var date = new Date(str),
  //     mnth = ("0" + (date.getMonth() + 1)).slice(-2),
  //     day = ("0" + date.getDate()).slice(-2);
  //   return [date.getFullYear(), mnth, day].join("-");
  // }
  
  const theMealEvent = new MealEvent({
    eventName: req.body.eventName,
    cuisine: req.body.cuisine,
    dish: req.body.dish,
    date: req.body.date,
    // date: convertDate(req.body.date),
    eventImg: req.file.secure_url,
    host: req.session.currentUser._id,
    guest: [],
    eventDescription: req.body.eventDescription,
    numberAttend: req.body.numberAttend,
    costScore: 10
  });

  theMealEvent.save()
    .then(mealevent => {
      // console.log('dateeee: ', req.body.date);

      User.updateOne({ _id: req.session.currentUser._id }, 
        { $addToSet: { hostedEvents: mealevent._id }
        }, { new: true })
        .then((data) => console.log('USER UPDATEDDDDD', data))
        .catch((err) => console.log(err))
    })
    .then(() => {
      res.redirect('/meal-events');
    })
    .catch((err) => {
      console.log(err);
      res.render('meal-views/create');
    });
});


// GET	/meal-events/:id --> Renders the meal event details page
router.get('/:id', (req, res, next) => {
  MealEvent.findOne({
      _id: req.params.id
    })
    .populate('host')
    .then((theMealEvent) => {
      // console.log('MEAL EVENT', theMealEvent);

      res.render('meal-views/show', {
        mealEvent: theMealEvent,
        userInfo: req.session.currentUser
      });
    })
    .catch((err) => console.log(err));
});


// GET /meal-events/:id/edit --> Renders the form to edit a specific meal event
router.get('/:id/edit', (req, res, next) => {
  MealEvent.findOne({
      _id: req.params.id
    })
    .then(theMealEvent => {
      res.render('meal-views/edit', {
        mealEvent: theMealEvent,
        userInfo: req.session.currentUser
      });
    })
    .catch((err) => console.log(err));
});

// PUT	/meal-events/:id/edit --> Updates the meal event in the DB
router.post('/:id', parser.single('eventImg'), (req, res, next) => {
  let previousImg;
  MealEvent.findById(req.params.id).then(theMealEvent => {
    previousImg = theMealEvent.eventImg;

    const imgUrl = req.file ? req.file.secure_url : previousImg;

    const updatedEvent = {
      eventName: req.body.eventName,
      cuisine: req.body.cuisine,
      dish: req.body.dish,
      date: req.body.date,
      eventImg: imgUrl,
      eventDescription: req.body.eventDescription,
      numberAttend: req.body.numberAttend,
    };
  
    MealEvent.update({ _id: req.params.id}, updatedEvent)
      .then(() => res.redirect(`/meal-events/${req.params.id}`))
      .catch((err) => console.log(err));
  });
});



// POST /meal-events/:id/attend --> Adds the current user in the meal-event pending guests array in the DB
router.post('/:id/attend', function (req, res, next) {
  const mealeventId = req.params.id;
  const currentUserId = req.session.currentUser._id;

  const pr1 = MealEvent.update(
    { _id: mealeventId }, 
    { $addToSet: { pendingGuests: currentUserId }}
  );

  const pr2 = User.update(
    { _id: currentUserId }, 
    { $addToSet: { pendingEvents: mealeventId }
  })

  Promise.all([pr1, pr2])
    .then(() => res.redirect(`/profile/${currentUserId}/events`))
    .catch((err) => console.log(err));
});


router.post('/:mealId/accept/:guestId',  (req, res, next) => {
    const mealeventId = req.params.mealId;
    const guestId = req.params.guestId;
    const currentUserId = req.session.currentUser._id;

    const pr1 = MealEvent.update({_id: mealeventId}, 
      { 
        $addToSet: {acceptedGuests: guestId},
        $pull: {pendingGuests: guestId}
      })

    const pr2 = User.update({_id: guestId}, 
      { 
        $addToSet: {attendedEvents: mealeventId},
        $pull: {pendingEvents: mealeventId}
      })

    Promise.all([pr1, pr2])
      .then( () => res.redirect(`/profile/${currentUserId}/events`))
      .catch( (err) => console.log(err));
})


router.post('/:mealId/decline/:guestId', (req, res, next) => {
  const mealeventId = req.params.mealId;
  const guestId = req.params.guestId;
  const currentUserId = req.session.currentUser._id;

  console.log('here1');
  const pr1 = MealEvent.update(
    {_id: mealeventId}, 
    { $pull: {pendingGuests: guestId} })

  console.log('here2')
  const pr2 = User.update(
    {_id: guestId}, 
    { $pull: {pendingEvents: mealeventId} })

  Promise.all([pr1, pr2])
    .then( () => {
      console.log('here3');
      res.redirect(`/profile/${currentUserId}/events`)
    })
    .catch( (err) => console.log(err));
})


// POST /meal-events/:id/cancel --> Removes the current user from the meal event guests array in the DB
router.post('/:id/cancel', function (req, res, next) {
  const mealeventId = req.params.id;
  const currentUserId = req.session.currentUser._id;

  const pr1 = MealEvent.update( 
    { _id: mealeventId },
    { $pull: { acceptedGuests: currentUserId} }
  );

  const pr2 = User.update( 
    { _id: currentUserId},
    { $pull: { attendedEvents: mealeventId} }
  )

  Promise.all([pr1, pr2])
  .then( () => res.redirect(`/profile/${currentUserId}/events`))
  .catch( (err) => console.log(err));
});


// DELETE	/meal-events/:id/delete --> Deletes the meal event in the DB
router.get('/:id/delete', (req, res, next) => {
  // console.log('DELETE', req.params);

  MealEvent.findOne({
      _id: req.params.id
    })
    .then((theMealEvent) => theMealEvent.remove())
    .then(() => res.redirect('/meal-events'))
    .catch((err) => console.log(err));
});



module.exports = router;