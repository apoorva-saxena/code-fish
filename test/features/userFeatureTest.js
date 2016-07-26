var app = require('../../app');
var Browser = require('zombie');
var http = require('http');

//
// Browser.localhost('localhost', 3001);

describe('User visits signup page', function() {

  var browser = new Browser();

  before(function(done) {
    server = http.createServer(app).listen(3001);
    browser = new Browser({site: 'http://localhost:3001'});
    done();
  });

  describe('Submits form', function() {

    before(function(done) {
      browser
        .fill('username', 'hello123')
        .fill('email', 'hello@hello.com')
        .fill('password', 'hello123')
        .fill('passwordconfirmation')
        .pressButton('Sign Up', done);
    });

    it('Should be successful', function() {
      browser.assert.success();
    });

  });

});
