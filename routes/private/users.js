const express = require('express');
const router = express.Router();
const User = require('./../../models/User');

// GET	/profile/:id	Private route. Renders user-views/show view.
router.get('/:id', (req, res, next) => {
    const { id } = req.params;

    User.findById(id)
    .then( (oneUser) => {
        console.log(oneUser);
        res.render('user-views/show', { oneUser })
    })
    .catch( (err) => {
        console.log(err);
        next();
    });
})

// GET	/profile/:id/edit	Private route. Renders user-views/edit form view.

// PUT	/profile/:id/edit	Private route. Sends edit-profile info to server and updates user in DB. Redirects to the user-views/show view (url: /profile/:id).

// DELETE	/profile/:id/delete

module.exports = router;