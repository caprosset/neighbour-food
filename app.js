require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const hbs = require('hbs');

const app = express();

// routers
const indexRouter = require('./routes/index');
const siteRouter = require('./routes/site-routes');

// Mongoose configuration
mongoose.connect('mongodb://localhost/neighbourfood', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware configuration
app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));


// Authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
  }),
);
app.use(cookieParser());



// ROUTES
app.use('/', indexRouter);
app.use('/', siteRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
