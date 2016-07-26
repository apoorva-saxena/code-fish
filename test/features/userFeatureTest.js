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
    browser.visit('/', done);
  });

  describe('Submits form', function() {

    before(function(done) {
      browser.visit('/users/signup', done);

    });

    it('Should see the sign up page', function() {
      browser.assert.text('h2', 'Sign up');
    });

    it('Should be successful', function() {
      browser
        .fill('username', 'hello123')
        .fill('email', 'hello@hello.com')
        .fill('password', 'hello123')
        .fill('passwordconfirmation')
        .pressButton('Sign Up');
      browser.assert.success();
    });

  });

});
