var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {currentUser: res.locals.user});
});

module.exports = router;
