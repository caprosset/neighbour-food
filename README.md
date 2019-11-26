# NeighbourFood


<br>


## Description

Shared platform for neighbours who would like to meet their next door person over a meal. You can host a dinner for your neighbours or attend one near you.



<br>

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault.
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault.
- **homepage** - As a user I want to be able to access the homepage and input my post code to check out the meals events happening near me, I also want to log in and sign up.
- **sign up** - As a user I want to sign up on the web page so that I can have access to the private pages, check the events information, host an event or attend one.
- **login** - As a user I want to be able to log in on the web page so that I can get back to my account.
- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account.
- **create profile** - As user I want to create a profile and add my information.
- **edit user** - As a user I want to be able to edit my profile.
- **delete user** - As a user I want to be able to delete my profile.
- **profile** - As user I want to check my profile page and check my personal information, the events I hosted, the events I attended and the upcoming events. As a host I'm able to accept or reject a guest. 
- **meal events** - As a user I want to see the list of the events, filter by near location and attend them.
- **host event** - As a user I want to be able to create a new event and add information for the event.
- **attend event** - As a user I want to be able to attend an event from the events list.



<br>



## API Routes (Back-end):



| **Method** | **Route**| **Description**|
|---|---|---|                             
| `GET`      | `/`  | Main page route.  Renders home `index` view. 
| `GET`      | `/login`  | Renders `auth-views/login` form view.              
| `POST`     | `/login`  | Sends Login form data to the server. Redirects to the `show-all` view (url: /meal-events).        
| `GET`      | `/signup` | Renders `auth-views/signup` form view.             
| `POST`     | `/signup` | Sends Sign Up info to the server and creates user in the DB. Redirects to the `meal-views/show-all` view (url: /meal-events).
| `GET`      | `/signout` | Renders the home `index` view.     
| `GET`      | `/profile/:id`| Private route. Renders `user-views/show` view.
| `GET`      | `/profile/:id/events`| Private route. Renders `user-views/myevents` view (url: /profile/:id/events).
| `GET`      | `/profile/:id/edit`| Private route. Renders `user-views/edit` form view. 
| `POST`      | `/profile/:id/edit`| Private route. Sends edit-profile info to server and updates user in DB. Redirects to the `user-views/show` view (url: /profile/:id).
| `POST`      | `/profile/:id/review`| Private route. Updates user in DB with a review from another user. Redirects to the `user-views/show` view (url: /profile/:id).
| `DELETE`   | `/profile/:id/delete`| Private route. Deletes the profile from the server and updates DB. Redirects to the `index` view (url: /).
| `GET`      | `/meal-events`   | Private route. Renders the `meal-views/show-all` view.
| `GET`     | `/meal-events/create` | Private route. Renders the `meal-views/create` form view to add a new event for the current user. 
| `POST`     | `/meal-events/create`  | Private route. Adds a new event for the current user. Redirects to the `meal-views/show-all` view (url: /meal-events).  
| `GET`   | `/meal-events/:id` | Private route. Renders the `meal-views/show` view.
| `POST`   | `/meal-events/:id/attend` | Private route. Updates the current event in the DB with the current user as a pending event, and the current user as a pending guest.
| `POST`   | `/meal-events/:id/cancel` | Private route. Updates the current event in the DB, removing the current user from the accepted guests.
| `POST`   | `/meal-events/:mealId/accept/:userId` | Private route. Updates the current event in the DB as a pending event, and the current user as an accepted guest.
| `POST`   | `/meal-events/:mealId/decline/:userId` | Private route. Removes the current event in the DB from the pending events, and the current user from the pending guests.
| `GET`   | `/meal-events/:id/edit` | Private route. Renders the `meal-views/edit` form view.
| `PUT`   | `/meal-events/:id/edit` | Private route. Updates the existing event from the current user in the DB. Redirects to the `user-views/myevents` view.
| `DELETE`   | `/meal-events/:id/delete` | Private route. Deletes the existing event from the current user. Redirects to the `meal-views/show-all` view (url: /meal-events).                                   



## Models

User model

```javascript
{
  name: {type: String, required: true} ,
  email: {type: String, required: true} ,
  password: {type: String, required: true},
  address: {
    street: {type: String, required: true},
    zipcode: {type: String, required: true},
    houseNumber: {type: String, required: true},
    city: {type: String, required: true} 
},
  description: {type: String, required: true},
  profileImg: {type: String, required: true},
  score: {type: Number},
  hostedEvents: [{  type: mongoose.Schema.Types.ObjectId, ref: "MealEvent"}],
  pendingEvents: [{  type: mongoose.Schema.Types.ObjectId, ref: "MealEvent"}],
  attendedEvents: [{  type: mongoose.Schema.Types.ObjectId, ref: "MealEvent"}], // attending events 
  reviews: {type: Array},
}
```



MealEvent model

```javascript
{
  eventName: {type: String, required: true} ,
  cuisine: {type: String, required: true} ,
  dish: {type: String, required: true} ,
  date: {type: Date, required: true} ,
  eventImg: {type: String} ,
  host: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  acceptedGuests: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  pendingGuests: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  eventDescription:{type: String, required: true} ,
  numberAttend: {type: Number, required: true} ,
  costScore: {type: Number},
}
```



<br>



## Backlog
- Add reviews to the users
- Filter events by distance
- Geolocation - Google Maps API
- Add a map in the event accepted page
- System of points ('forks') as an exchange system for the meals
- Instructions page for first signup
- Inbox Messages - Send/receive messages between users
- Add a event to Favorites
- Authentication with Gmail/ Facebook accounts


<br>



## Links

[See the Trello board.](https://trello.com/invite/b/OBlApTPe/52825291d577d19ce2660b9daef60c74/neighbourfood)

### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/barbara-carnieri/NeighbourFood)

[Deploy Link](https://neighbourfood-app.herokuapp.com/)



<br>



### Slides

The url to your presentation slides

[Slides Link](https://docs.google.com/presentation/d/1l5qIG2EUfpLOrq03qfnhR5MfcSgXUXkDiSyaL_Byyt4/edit?usp=sharings)