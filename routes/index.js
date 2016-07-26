var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/requests/new', function(req, res, next) {
  res.render('requests/new');
});

router.post('/requests/new', function(req, res, next) {
  var request = {
    description: req.body.description
  };
  res.redirect('/chats/new');
});


router.get('/chats/new', function(req, res, next) {
  res.render('chats/new');
});




module.exports = router;
