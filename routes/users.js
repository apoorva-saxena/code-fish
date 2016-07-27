var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  res.render('users/signup');
});

router.post('/signup', function(req, res, next) {

  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var passwordconfirmation = req.body.passwordconfirmation;

  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('passwordconfirmation', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors) {
    res.render('users/signup', {
      errors: errors
    });
  } else {
    var newUser = new User({
      username: username,
      email: email,
      password: password
    });
    User.createUser(newUser, function(err, user) {
      if(err) throw err;

    });

    req.flash('success_msg', 'You are registered and can now log in');

    res.redirect('/');
  }

});

router.get('/signin', function(req, res, next) {
  res.render('users/signin');
});

router.post('/signin', function(req, res, next) {
  passport.authenticate('local', { failureFlash: 'Wrong credentials'
});

  // req.flash('success_msg', 'You are logged in');
});

module.exports = router;
