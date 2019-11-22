const express = require('express');
const router = express.Router();


// GET '/meal-events' -- renders all the events
router.get('/', (req, res, next) => {
    res.render('meal-views/show-all');
  });
  

//   GET	/meal-events/create	Private route. Renders the meal-views/create form view to add a new event for the current user.


// POST	/meal-events/create	Private route. Adds a new event for the current user. Redirects to the meal-views/show-all view (url: /meal-events).


// GET	/meal-events/:id	Private route. Renders the meal-views/show view.


// GET	/meal-events/:id/edit	Private route. Renders the meal-views/edit form view.


// PUT	/meal-events/:id/edit	Private route. Updates the existing event from the current user in the DB. Redirects to the user-views/myevents view.



// DELETE	/meal-events/:id/delete

module.exports = router;