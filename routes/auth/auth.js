const express = require('express');
const router = express.Router();
const User = require('./../../models/User');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const parser = require('../../config/cloudinary');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// POST '/auth/signup'
router.post('/signup', parser.single('profileImg'),(req, res, next) => {
  // Destructure the password and email
  // console.log('Bodyyyyyyy', req.file.secure_url);
  console.log('Bodyyyyyyy', req.body);

  const { name, email, password, street, houseNumber, zipcode, city, description, score } = req.body;
  const profileImg = req.file.secure_url;

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
    User.create({ name, email, password: hashedPassword, address: {street, houseNumber, zipcode, city}, description, profileImg, score: 10 })
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

  // Find the user by username
  User.findOne({ email })
  .then(userData => {
    // If - username doesn't exist - return error
    if (!userData) {
      res.render('auth-views/login', { errorMessage: 'User not found!' });
      return;
    }

    // If username exists - check if the password is correct
    const hashedPasswordFromDB = userData.password; 

    const passwordCorrect = bcrypt.compareSync(
      enteredPassword,
      hashedPasswordFromDB,
    );

    // If password is correct - create session (& cookie) and redirect
    // if(enteredPassword === userData.password){
    if (passwordCorrect) {
      // Save the login in the session ( and create cookie )
      // And redirect the user
      req.session.currentUser = userData;
      res.redirect('/meal-events');
    } else {
      // Else - if password incorrect - return error
      res.render('auth-views/login', { errorMessage: 'Incorrect password' });
      return;
    }
  })
  .catch(err => console.log(err));
});

module.exports = router;