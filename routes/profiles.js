var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var connect = require('connect');

router.get('/', function(req, res, next) {
  console.log("Inside profile");
  User.findOne({ _id: req.user._id}, function(err, user) {
    if(err) {
      return next(err);
    }
    else {
      res.render('users/profile', { user:user });
    }
  });
});
