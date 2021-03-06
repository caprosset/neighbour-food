const express = require("express");
const router = express.Router();
const User = require("./../../models/User");
const MealEvent = require("./../../models/MealEvent");
const parser = require("../../config/cloudinary");



// GET	/profile --> Redirects to the profile page
router.get("/", (req, res, next) => {
  res.redirect(`/profile/${req.session.currentUser._id}`);
});



// GET	/profile/:id --> Renders the profile page
router.get("/:id", (req, res, next) => {
  User.findById(req.params.id)
    .populate('hostedEvents pendingEvents attendedEvents')
    .then(user => {
      let arrayOfGuests;
      user.hostedEvents.forEach(event => {
        arrayOfGuests = event.acceptedGuests;
      })

      let host;
      user.attendedEvents.forEach(event => {
        host = event.host;
      })

      res.render("user-views/show", { user, host, arrayOfGuests });
    })
    .catch(err => next(err));
});



// GET /profile/:id/events --> Renders the 'my events' page
router.get("/:id/events", (req, res, next) => {
  User.findById(req.params.id)
    .populate([
      "pendingEvents",
      "attendedEvents",
      {
        path: 'hostedEvents',
        model: 'MealEvent',
        populate: [
          { path: 'pendingGuests', model: 'User' },
          { path: 'acceptedGuests', model: 'User' }
        ]
      }
    ])
    .then(user => {
      res.render("user-views/myevents", {
        mealEventHost: user.hostedEvents,
        mealEventPendingGuests: user.hostedEvents.pendingGuests,
        mealEventPending: user.pendingEvents,
        mealEventGuest: user.attendedEvents
      });
    })
    .catch((err) => console.log(err));
});


// GET	/profile/:id/edit --> Renders the edit form to edit user profile
router.get("/:id/edit", (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      res.render("user-views/edit", { user });
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
  User.findOne({
    _id: req.params.id
  })
    .then(theUser => theUser.remove())
    .then(() => req.session.destroy())
    .then(() => res.redirect("/"))
    .catch(err => console.log(err));
});


module.exports = router;
