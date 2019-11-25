const express = require('express');
const router = express.Router();
const User = require('./../../models/User');
const MealEvent = require('./../../models/MealEvent');
// const axios = require('axios');


// GET	/profile --> Redirects to the profile page
router.get('/', (req, res, next) => {
    const id = req.session.currentUser._id;
    res.redirect(`/profile/${id}`)
})

// GET	/profile/:id --> Renders the profile page
router.get('/:id', (req, res, next) => {
    User.findById(req.params.id)
    .then( (oneUser) => {
        // console.log(oneUser);
        res.render('user-views/show', { oneUser, userInfo: req.session.currentUser });
    })
    .catch( (err) => {
        console.log(err);
        next();
    });
})

// GET /profile/:id/events --> Renders the 'my events' page
router.get('/:id/events', (req, res, next) => {
    User.findById(req.params.id)
    .then( (oneUser) => {
        // console.log(oneUser);
        const pr1 = MealEvent.find( {_id: oneUser.hostedEvents} );
        const pr2 = MealEvent.find( {_id: oneUser.attendedEvents} );

        Promise.all([pr1, pr2])
        .then( (mealEvents) => {
            // console.log('EVENTS I HOST', mealEvents[0]);
            // console.log('EVENTS I ATTEND', mealEvents[1]);
            
            const mealEventIhost = mealEvents[0];
            const mealEventIattend = mealEvents[1];

            res.render('user-views/myevents', { 
                mealEventHost: mealEventIhost, 
                mealEventGuest: mealEventIattend,
                userInfo: req.session.currentUser
            });
        })
        .catch( (err) => console.log(err));
    })
    .catch( (err) => {
        console.log(err);
        next();
    });
})


// GET	/profile/:id/edit --> Renders the edit form to edit user profile
router.get('/:id/edit', (req, res, next) => {
    User.findById(req.params.id)
    .then( (oneUser) => {
        // console.log(oneUser);
        res.render('user-views/edit', { oneUser, userInfo: req.session.currentUser })
    })
    .catch( (err) => {
        console.log(err);
        next();
    });
})


// POST	/profile/:id/ --> updates the user info in DB. Redirects to the profile page
router.post('/:id/edit', (req, res, next) => {
    console.log('PARAMS -->', req.params);
    console.log('BODY -->', req.body);

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
        profileImg: req.body.profileImg
    };
    // console.log('THIS IS THE UPDATED USER', updatedUser);
    
    User.update({_id: id}, updatedUser, (err) => {
        if (err) {
            return next(err);
        }
        res.redirect(`/profile/${id}`); 
    });
})



// POST /profile/{{oneUser._id}}/review --> saves the newly created review in the DB
router.post('/:id/review', (req, res, next) => {
    // console.log('BODY -->', req.body.review);
    const id = req.params.id;
    const reviewToInsert = req.body.review;

    User.updateOne({ _id: id}, { $addToSet: { reviews: reviewToInsert}}, {new: true})
    .then( () => {
        res.redirect(`/profile/${req.params.id}`); 
    })
    .catch( (err) => console.log(err));
})


// DELETE	/profile/:id/delete
router.get('/:id/delete', function(req, res, next) {
    console.log('ID TO DELETE', req.params);
    const id = req.params.id;

    User.findOne({ _id: id }, (err, theUser) => {
        if (err) {
            return next(err);
        }

        theUser.remove(err => {
            if (err) {
                return next(err);
            }

            res.redirect('/');
        });
    });
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