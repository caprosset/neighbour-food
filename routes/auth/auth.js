const express = require('express');
const router = express.Router();
const User = require('./../../models/User');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// POST '/auth/signup'
router.post('/signup', (req, res, next) => {
  // Destructure the password and email
  // console.log('Bodyyyyyyy', req.body);
  const { name, email, password, street, houseNumber, zipcode, city, description, profileImg } = req.body;
  
  // Check if the email and password are empty strings
  if (email === '' || password === '' || name === '' || street === '' ||  zipcode === '' || houseNumber === '' || city === '' ||   description === '' || profileImg === '') {
    res.render('auth-views/signup', {
      errorMessage: 'Provide username and password.',
    });
    return;
  }

  //Check if the email already exists - if so send error
  User.findOne({ email })
    .then(user => {
      // > If email exists already send the error
      if (user) {
        res.render('auth-views/signup', {
          errorMessage: 'Username already exists.',
        });
        return;
      }

    // > If email doesn't exist, generate salts and hash the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // > Create the user in the DB
    User.create({ name, email, password: hashedPassword, address: {street, houseNumber, zipcode, city}, description, profileImg })
      .then(newUserObj => {
        req.session.currentUser = newUserObj; // triggers the cookie setting and allows us to be directly logged in

        // console.log('OBJECT SENT TO DBBBBBBBBBB', newUserObj);
        
        // > Once the user is created , redirect to private home
        res.redirect('/meal-events');
      })
      .catch(err => {
        res.render('auth-views/signup', {
          errorMessage: `Error while creating new user: ${err}`,
        });
      });
      // console.log('I HAVE SIGNED UP');
      
  })
  .catch(err => console.log(err));
});



// POST 'auth/login'
router.post('/login', (req, res, next) => {
  // Deconstruct the password and the user
  const { email, password: enteredPassword } = req.body;

  // Check if email or password are empty strings
  if (email === '' || enteredPassword === '') {
    res.render('auth-views/login', {
      errorMessage: 'Please provide email and password',
    });
    return;
  }

  // Find the user by email
  User.findOne({ email })
    .then(userData => {
      // If email exists - check if the password is correct
      const hashedPasswordFromDB = userData.password; 

      const passwordCorrect = bcrypt.compareSync(
        enteredPassword,
        hashedPasswordFromDB,
      );

      // If email exists and password is correct - create session (& cookie) and redirect
      if (userData && passwordCorrect) {
        // Save the login in the session ( and create cookie )
        // And redirect the user
        req.session.currentUser = userData;
        res.redirect('/meal-events');
      } else {
        // If email doesn't exist or password is incorrect - return error
        res.render('auth-views/login', { errorMessage: 'Incorrect email or password' });
        return;
      }
    })
    .catch(err => console.log(err));
});

module.exports = router;