var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var connect = require('connect');
var GitHubStrategy = require('passport-github').Strategy;

var GITHUB_CLIENT_ID = "f15bb76b68279c20ce4c";
var GITHUB_CLIENT_SECRET = "16b4ee54f1043591636fae42d1aa604a1590db0a";



router.get('/new', function(req, res, next) {
    res.render('sessions/new');
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }
            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));


passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    console.log(profile);
    var newUser = new User({
      username: profile.displayName,
      githubid: profile.id
    });
    newUser.save();

    return done(null, profile);
  });
}
));



passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/new',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/sessions/new',
        failureFlash: true
    }));

router.get('/destroy', function(req, res){
    req.logout();
    req.flash('success_msg', 'Successfully signed out');
    res.redirect('/');
});



module.exports = router;
