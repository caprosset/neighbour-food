const express = require('express');
const router = express.Router();

const MealEvent = require('../../models/MealEvent');
const User = require('../../models/User');

const parser = require('../../config/cloudinary');

require('dotenv').config();


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
      // console.log('USERS ID', allMealEventsFromDB[0].userId)

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
    pendingGuests: [],
    acceptedGuests: [],
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
  // pass an error message if user has not enough forks
  const { error } = req.query;
  const errorMessage = error ? "You don't have enough forks to attend this event! Create one and earn 10 forks per guest" : undefined;

  MealEvent.findOne({
      _id: req.params.id
    })
    .populate('host pendingGuests acceptedGuests')
    .then((theMealEvent) => {
      // console.log('MEAL EVENT', theMealEvent);
      const userInfo = req.session.currentUser;
      let type = {};

      theMealEvent.acceptedGuests.forEach(guest => {
        console.log('ACCEPTED GUEST IDSSS', guest._id);
        if(guest._id.equals(userInfo._id)) {
          type.accepted = true;
        }
      })

      theMealEvent.pendingGuests.forEach(guest => {
        console.log('PENDING GUEST IDSSS', guest._id);
        if(guest._id.equals(userInfo._id)) {
          type.pending = true;
        } 
      })
    
      let hostAddress = theMealEvent.host.address.street + ' ' + theMealEvent.host.address.houseNumber + ', ' + theMealEvent.host.address.zipcode + ' ' + theMealEvent.host.address.city;
      // console.log('HOST ADDRESSS', hostAddress);

      let userAddress = userInfo.address.street + ' ' + userInfo.address.houseNumber + ', ' + userInfo.address.zipcode + ' ' + userInfo.address.city;
      // console.log('USER ADDRESSS', userAddress);

      let api_key = process.env.MAPS_API_KEY;

      const userIsHost = theMealEvent.host._id === userInfo._id;
      console.log('user is host ',userIsHost);

      res.render('meal-views/show', {
        userIsHost,
        mealEvent: theMealEvent,
        type,
        hostAddress,
        userAddress,
        userInfo,
        api_key,
        errorMessage
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


// POST /meal-events/:id/attend --> Adds the current user in the meal-event pendingGuests array && in the user pendingEvents array in the DB
router.post('/:id/attend', function (req, res, next) {
  const mealeventId = req.params.id;
  const currentUser = req.session.currentUser;

  if(currentUser.score >= 10) {
    const pr1 = MealEvent.update(
      { _id: mealeventId }, 
      { $addToSet: { pendingGuests: currentUser._id }}
    );
  
    const pr2 = User.update(
      { _id: currentUser._id }, 
      { $addToSet: { pendingEvents: mealeventId } }
    );
  
    Promise.all([pr1, pr2])
      .then(() => res.redirect(`/profile/${currentUser._id}/events`))
      .catch((err) => console.log(err));
  } else {
    res.redirect(`/meal-events/${mealeventId}?error=noforks`);
  }
});


// POST /meal-events/:mealId/accept/:guestId --> Adds the current user in the meal-event acceptedGuests && in the user attendedEvents array in the DB
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
        $pull: {pendingEvents: mealeventId},
        $inc: { score: -10 }
      })
    
    const pr3 = User.update({_id: currentUserId}, 
      { 
        $inc: { score: 10 }
      })

    Promise.all([pr1, pr2, pr3])
    .then(() => User.findById(currentUserId))
    .then(updatedUser => {
      // console.log('UPDATED USER', updatedUser);
      req.session.currentUser = updatedUser;
      res.redirect(`/profile/${currentUserId}/events`)
      })
      .catch( (err) => console.log(err));
})


// POST /meal-events/:mealId/decline/:guestId --> Removes the current user from both the the meal-event pendingGuests array && the user pendingEvents array in the DB 
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

  MealEvent.findById({_id: mealeventId})
  .then( event => {
    console.log('HOST ID', event.host);
    User.update(
      { _id: event.host},
      { $inc: { score: -10 } })
      .then( (data) => console.log('UPDATED HOST SCOREEE', data))
      .catch( (err) => console.log(err));
  })
  .catch( (err) => console.log(err));

  const pr1 = MealEvent.update( 
    { _id: mealeventId },
    { $pull: { acceptedGuests: currentUserId} }
  );

  const pr2 = User.update( 
    { _id: currentUserId},
    { $pull: { attendedEvents: mealeventId},
      $inc: { score: 10} }
  )
    
  Promise.all([pr1, pr2])
  .then(() => User.findById(currentUserId))
  .then(updatedUser => {
    // console.log('UPDATED USER', updatedUser);
    req.session.currentUser = updatedUser;
    res.redirect(`/profile/${currentUserId}/events`)
    })
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