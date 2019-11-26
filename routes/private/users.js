const express = require("express");
const router = express.Router();
const User = require("./../../models/User");
const MealEvent = require("./../../models/MealEvent");
// const axios = require('axios');
const parser = require("../../config/cloudinary");

// GET	/profile --> Redirects to the profile page
router.get("/", (req, res, next) => {
  const id = req.session.currentUser._id;
  res.redirect(`/profile/${id}`);
});

// GET	/profile/:id --> Renders the profile page
router.get("/:id", (req, res, next) => {
  User.findById(req.params.id)
  .populate('hostedEvents pendingEvents attendedEvents')
  .then(oneUser => {
    // console.log(oneUser);
    let arrayOfGuests;
    oneUser.hostedEvents.forEach(event => {
      arrayOfGuests = event.acceptedGuests;
    })
    // console.log('HOSTED EVENTS', arrayOfGuests);
    
    res.render("user-views/show", {
      oneUser,
      arrayOfGuests,
      userInfo: req.session.currentUser
    });
    })
    .catch(err => console.log(err));
});

// GET /profile/:id/events --> Renders the 'my events' page
router.get("/:id/events", (req, res, next) => {
  // console.log('HELLPPPPPP');
  
  User.findById(req.params.id)
    .populate("hostedEvents hostedEvents.pendingGuests pendingEvents attendedEvents")
    .then(oneUser => {
      console.log(
        "mealEventHost:",
        oneUser.hostedEvents,
        "mealEventPending:",
        oneUser.pendingEvents,
        "mealEventGuest:",
        oneUser.attendedEvents
      );

      // save guests names of the hosted events into an array
      const myArr = [];

      if(oneUser.hostedEvents.length) {
        oneUser.hostedEvents.forEach(mealhost => {
          // console.log("PENDING GUESTS", mealhost.pendingGuests);
          console.log('mealhost', mealhost);
          
          if(mealhost.pendingGuests.length) {
            mealhost.pendingGuests.forEach(guestId => {
              User.findById(guestId)
                .then(guestObj => {
                  // console.log("GUEST OBJECT", guestObj);
                  return myArr.push(guestObj.name);
                })
                .then(() => {
                  // console.log("MY ARRAYYYYoooo", myArr);
                  return myArr;
                })
                .then(() => {
                  res.render("user-views/myevents", {
                    guestsName: myArr,
                    mealEventHost: oneUser.hostedEvents,
                    mealEventPending: oneUser.pendingEvents,
                    mealEventGuest: oneUser.attendedEvents,
                    userInfo: req.session.currentUser
                  });
                })
                .catch(err => console.log(err));
            });
          } else {
            // console.log('hola');
            
            res.render("user-views/myevents", {
              mealEventHost: oneUser.hostedEvents,
              mealEventPending: oneUser.pendingEvents,
              mealEventGuest: oneUser.attendedEvents,
              userInfo: req.session.currentUser
            });
          }
      
        });
      } else {
        console.log('hola');
            
            res.render("user-views/myevents", {
              mealEventHost: oneUser.hostedEvents,
              mealEventPending: oneUser.pendingEvents,
              mealEventGuest: oneUser.attendedEvents,
              userInfo: req.session.currentUser
            });
      }
    })
    .catch(err => console.log(err));
});

// GET	/profile/:id/edit --> Renders the edit form to edit user profile
router.get("/:id/edit", (req, res, next) => {
  User.findById(req.params.id)
    .then(oneUser => {
      // console.log(oneUser);
      res.render("user-views/edit", {
        oneUser,
        userInfo: req.session.currentUser
      });
    })
    .catch(err => console.log(err));
});

// POST	/profile/:id/ --> updates the user info in DB. Redirects to the profile page
router.post("/:id/edit", parser.single("profileImg"), (req, res, next) => {
  // console.log('PARAMS -->', req.params);
  // console.log('BODY -->', req.body);

  let previousUserImg;

  User.findById(req.params.id)
    .then(theUserProfile => {
      previousUserImg = theUserProfile.profileImg;

      const imgUserUrl = req.file ? req.file.secure_url : previousUserImg;

      const id = req.params.id;
      const updatedUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        "address.street": req.body.street,
        "address.houseNumber": req.body.houseNumber,
        "address.zipcode": req.body.zipcode,
        "address.city": req.body.city,
        description: req.body.description,
        profileImg: imgUserUrl
      };

      User.update(
        {
          _id: id
        },
        updatedUser
      )
        .then(() => {
          return User.findById(id);
        })
        .then(updatedUser => {
          // console.log('UPDATED USER', updatedUser);
          req.session.currentUser = updatedUser;
          res.redirect(`/profile/${id}`);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

// POST /profile/{{oneUser._id}}/review --> saves the newly created review in the DB
router.post("/:id/review", (req, res, next) => {
  // console.log('BODY -->', req.body.review);
  const id = req.params.id;
  const reviewToInsert = req.body.review;

  User.updateOne(
    { _id: id },
    { $addToSet: { reviews: reviewToInsert } },
    { new: true }
  )
    .then(() => res.redirect(`/profile/${req.params.id}`))
    .catch(err => console.log(err));
});

// DELETE	/profile/:id/delete
router.get("/:id/delete", function(req, res, next) {
  // console.log('ID TO DELETE', req.params);

  User.findOne({
    _id: req.params.id
  })
    .then(theUser => theUser.remove())
    .then(() => req.session.destroy())
    .then(() => res.redirect("/"))
    .catch(err => console.log(err));
});

// deleteButton.addEventListener('onclick', (e) => {
// e.preventDefault();

// axios.delete('/:id/delete')
//     .then( () => {
//         console.log('DELETED');

//     })
//     .catch( (err) => console.log(err));
// });

module.exports = router;
