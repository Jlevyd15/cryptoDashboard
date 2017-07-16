var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport')
 , LocalStrategy = require('passport-local').Strategy;
 var flash = require('connect-flash');
var session = require('express-session');
require('dotenv').config();

var routes = require('./routes/index');
var users = require('./routes/users');
// var coinMarketCap = require('./routes/api/coinMarketCap');

var app = express();

//set the port to run on one that is specified or 5000
app.set('port', (process.env.PORT || 5000));

//setup connetion to db
var localMongoUri = 'mongodb://127.0.0.1/passport-auth';
// mongoose.connect(process.env.MONGODB_URI);
mongoose.connect(localMongoUri);
var db = mongoose.connection;
db.on('error', function() {
console.log("Please start the mongo db instanse before running npm start");
throw new Error('unable to connect to database at');
});


// pass passport for configuration
require('./config/passport')(passport); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// required for passport
// console.log('test', process.env.SECRET)
app.use(session({ secret: process.env.SECRET })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
require('./routes/routes.js')(app, passport);
require('./routes/api/index.js')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//stuff for authentication
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

//start the app and listen on the specified port
app.listen(app.get('port'), function(){
    console.log('NICE! We\'re running on port', app.get('port'));
});

module.exports = app;
