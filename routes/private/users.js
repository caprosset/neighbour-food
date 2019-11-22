const express = require('express');
const router = express.Router();

// GET	/profile/:id	Private route. Renders user-views/show view.
router.get('/:id', (req, res, next) => {
    res.render('user-views/show');
})

// GET	/profile/:id/edit	Private route. Renders user-views/edit form view.

// PUT	/profile/:id/edit	Private route. Sends edit-profile info to server and updates user in DB. Redirects to the user-views/show view (url: /profile/:id).

// DELETE	/profile/:id/delete

module.exports = router;