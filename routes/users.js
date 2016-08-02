var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var connect = require('connect');
var multer = require('multer');
var upload = multer({
    dest: 'public/img'
});

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/new', function(req, res, next) {
    res.render('users/new');
});

router.post('/new', function(req, res, next) {
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
        res.render('users/new', {
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

router.get('/:_id', loggedIn, function(req, res, next) {
    User.findById({
        _id: req.user._id
    }, function(err, user) {
        if (err) {
            return next(err);
        }
        res.render('users/profile', {
            user: user
        });
    });
});

router.get('/:_id/edit', loggedIn, function(req, res, next) {
    res.render('users/edit');
});

router.post('/:_id/edit', upload.single('image'), function(req, res, next) {

    User.findOne({
        _id: req.user._id
    }, function(err, user) {
        if (err) return next(err);

        if (req.body.email) user.email = req.body.email;
        if (req.body.bio) user.bio = req.body.bio;
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        if (req.file.filename) user.image = req.file.filename;

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', 'Successfully edited your profile');
            return res.redirect('/users/' + user._id);
        });
    });
});

module.exports = router;
