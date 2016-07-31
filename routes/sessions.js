var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var connect = require('connect');

router.get('/new', function(req, res, next) {
    res.render('sessions/new');
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {
                    message: 'Unknown User'
                });
            }
            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
            });
        });
    }));


passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/new',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/sessions/new',
        failureFlash: true
    }));

router.get('/destroy', function(req, res) {
    req.logout();
    req.flash('success_msg', 'Successfully signed out');
    res.redirect('/');
});

router.get('/profile', function(req, res, next) {
    User.findById({
        _id: req.user._id
    }, function(err, user) {
        if (err) {
          console.log('cannot find')
          return next(err);
        }
        console.log(user)
        res.render('sessions/profile', {
            user: user
        });
    });
});

router.get('/edit-profile', function(req, res, next) {
  res.render('sessions/edit-profile');
});

router.post('/edit-profile', function(req, res, next) {
  console.log(req.user._id);
  User.findOne({ _id: req.user._id}, function(err, user)
  {
    console.log(user.email);
    if(err) return next(err);

    if(req.body.email) user.email = req.body.email;
    if(req.body.bio) user.bio = req.body.bio;
    if(req.body.firstname) user.firstname = req.body.firstname;
    if(req.body.lastname) user.lastname = req.body.lastname;

    user.save(function(err) {
      if(err) return next(err);
      req.flash('success', 'Successfully edited your profile');
      return res.redirect('/edit-profile');
    });
  });
});

module.exports = router;
