var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var connect = require('connect');

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

    if (errors) {
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
            if (err) throw err;

        });
        req.flash('success_msg', 'You are registered and can now log in');
        res.redirect('/');
    }
});

router.get('/signin', function(req, res, next) {
    res.render('users/signin');
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                console.log('user not returned');
                return done(null, false, {
                    message: 'Unknown User'
                });
            }
            console.log('user returned');
            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    console.log('matched the passwords!');
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
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/signin',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/signin',
        failureFlash: true
    }),
    function(req, res) {
        console.log('redirecting');
        res.redirect('/');
    });

module.exports = router;
