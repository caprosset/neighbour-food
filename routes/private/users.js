const express = require('express');
const router = express.Router();
const User = require('./../../models/User');

// const deleteButton = document.querySelector('#delete-button');


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
        street: req.body.street,
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



module.exports = router;