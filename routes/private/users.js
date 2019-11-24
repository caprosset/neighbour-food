const express = require('express');
const router = express.Router();
const User = require('./../../models/User');
const MealEvent = require('./../../models/MealEvent');
// const axios = require('axios');


// GET	/profile
router.get('/', (req, res, next) => {
    const id = req.session.currentUser._id;
    res.redirect(`/profile/${id}`)
})

// GET	/profile/:id	Private route. Renders user-views/show view.
router.get('/:id', (req, res, next) => {
    User.findById(req.params.id)
    .then( (oneUser) => {
        console.log(oneUser);
        res.render('user-views/show', { oneUser });
    })
    .catch( (err) => {
        console.log(err);
        next();
    });
})

// GET /profile/:id/events Private route. Renders user-views/myevent view.
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

            res.render('user-views/myevents', { mealEventHost: mealEventIhost, mealEventGuest: mealEventIattend});
        })
        .catch( (err) => console.log(err));
    })
    .catch( (err) => {
        console.log(err);
        next();
    });
})


// GET	/profile/:id/edit	Private route. Renders user-views/edit form view.
router.get('/:id/edit', (req, res, next) => {
    User.findById(req.params.id)
    .then( (oneUser) => {
        console.log(oneUser);
        res.render('user-views/edit', { oneUser })
    })
    .catch( (err) => {
        console.log(err);
        next();
    });
})

// POST	/profile/:id/	Private route. Sends edit-profile info to server and updates user in DB. Redirects to the user-views/show view (url: /profile/:id).
router.post('/:id/edit', (req, res, next) => {
    console.log('PARAMS -->', req.params);
    console.log('BODY -->', req.body);

    const id = req.params.id;
    // console.log('THIS IS THE ID', id);

    const updatedUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        addstreet: req.body.street,
        houseNumber: req.body.houseNumber,
        zipcode: req.body.zipcode,
        city: req.body.city,
        description: req.body.description,
        profileImg: req.body.profileImg
    };

    User.update({_id: id}, updatedUser, (err) => {
        if (err) {
            return next(err);
        }
        res.redirect(`/profile/${id}`); 
    });
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