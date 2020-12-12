require('dotenv').config();

const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const registerHelpers = require('./loaders/hbs');
const connectDb = require("./config/db.config");
const connectSession = require("./config/session.config");

const app = express();

// routers
const indexRouter = require('./routes/index');
const siteRouter = require('./routes/site-routes');

// Mongoose connection
connectDb();

// Middleware configuration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// HBS helpers
registerHelpers(hbs);

// Authentication
connectSession(app);
app.use(cookieParser());

// locals
app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  next();
});


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
