const express = require("express");
const router = express.Router();
const User = require("./../../models/User");
const MealEvent = require("./../../models/MealEvent");
const parser = require("../../config/cloudinary");


// Set Current User
let currentUser;
router.use((req, res, next) => {
  if (req.session.currentUser) { // If there is a session
    currentUser = req.session.currentUser;
    next();
  }
})


// GET	/profile --> Redirects to the profile page
router.get("/", (req, res, next) => {
  res.redirect(`/profile/${currentUser._id}`);
});

// GET	/profile/:id --> Renders the profile page
router.get("/:id", (req, res, next) => {
  User.findById(req.params.id)
    .populate('hostedEvents pendingEvents attendedEvents')
    .then(oneUser => {
      // console.log(oneUser);
      // console.log(currentUser);


      let arrayOfGuests;
      oneUser.hostedEvents.forEach(event => {
        arrayOfGuests = event.acceptedGuests;
      })
      // console.log('GUESTS ARRAY', arrayOfGuests);

      let host;
      oneUser.attendedEvents.forEach(event => {
        host = event.host;
      })
      // console.log('HOST ID', host);

      res.render("user-views/show", {
        oneUser,
        host,
        arrayOfGuests
      });
    })
    .catch(err => next(err));
});


// GET /profile/:id/events --> Renders the 'my events' page
router.get("/:id/events", (req, res, next) => {

  User.findById(req.params.id)
    .populate("hostedEvents hostedEvents.pendingGuests pendingEvents attendedEvents")
    .then(oneUser => {
      // save guests names of the hosted events into an array
      const myArr = [];

      if (oneUser.hostedEvents.length) {
        oneUser.hostedEvents.forEach(mealhost => {
          if (mealhost.pendingGuests.length) {
            mealhost.pendingGuests.forEach(guestId => {
              User.findById(guestId)
                .then(guestObj => {
                  return myArr.push(guestObj);
                })
                .then(() => {
                  console.log("MY ARRAYYYYoooo", myArr);
                  return myArr;
                })
                .then(() => {
                  res.render("user-views/myevents", {
                    guestsInfo: myArr,
                    mealEventHost: oneUser.hostedEvents,
                    mealEventPending: oneUser.pendingEvents,
                    mealEventGuest: oneUser.attendedEvents,
                    userInfo: currentUser
                  });
                })
                .catch(err => console.log(err));
            });
          } else {
            res.render("user-views/myevents", {
              mealEventHost: oneUser.hostedEvents,
              mealEventPending: oneUser.pendingEvents,
              mealEventGuest: oneUser.attendedEvents,
              userInfo: currentUser
            });
          }

        });
      } else {
        res.render("user-views/myevents", {
          mealEventHost: oneUser.hostedEvents,
          mealEventPending: oneUser.pendingEvents,
          mealEventGuest: oneUser.attendedEvents,
          userInfo: currentUser
        });
      }
    })
    .catch(err => next(err));
});

// GET	/profile/:id/edit --> Renders the edit form to edit user profile
router.get("/:id/edit", (req, res, next) => {
  User.findById(req.params.id)
    .then(oneUser => {
      res.render("user-views/edit", {
        oneUser,
        userInfo: currentUser
      });
    })
    .catch(err => next(err));
});

// POST	/profile/:id/ --> updates the user info in DB. Redirects to the profile page
router.post("/:id/edit", parser.single("profileImg"), (req, res, next) => {
  let previousUserImg;

  User.findById(req.params.id)
    .then(theUserProfile => {
      previousUserImg = theUserProfile.profileImg;
      const imgUserUrl = req.file ? req.file.secure_url : previousUserImg;

      const { name, email, password, street, houseNumber, zipcode, city, description } = req.body;

      const updatedUser = {
        name,
        email,
        password,
        "address.street": street,
        "address.houseNumber": houseNumber,
        "address.zipcode": zipcode,
        "address.city": city,
        description,
        profileImg: imgUserUrl
      };

      User.update({ _id: req.params.id }, updatedUser)
        .then(() => User.findById(req.params.id))
        .then(updatedUser => {
          req.session.currentUser = updatedUser;
          res.redirect(`/profile/${req.params.id}`);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});


// POST /profile/{{oneUser._id}}/review --> saves the newly created review in the DB
router.post("/:id/review", (req, res, next) => {
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
router.get("/:id/delete", function (req, res, next) {
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
