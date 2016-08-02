var express = require('express');
var router = express.Router();

router.get('/code', function(req, res, next) {
  res.render('code');
});


module.exports = router;
