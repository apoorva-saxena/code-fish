var app = require('../../app');
var Browser = require('zombie');
var http = require('http');
var server = http.createServer(app);

describe('User visits signup page', function() {

  var browser = new Browser();

  beforeEach(function(done) {
    server.listen(3001);
    browser = new Browser({site: 'http://localhost:3001'});
    browser.visit('/', done);
  });

  afterEach(function() {
    server.close();
  });

  describe('Submits form', function() {

    beforeEach(function(done) {
      browser.visit('/users/signup', done);
    });

    it('Should see the sign up page', function() {
      browser.assert.text('h2', 'Sign up');
    });

    it('Should be successful', function() {
      browser.visit('/users/signup', function() {
      browser.fill('username', 'hello123')
        .fill('email', 'hello@hello.com')
        .fill('password', 'hello123')
        .fill('passwordconfirmation', 'hello123')
        .pressButton('Sign Up');
      browser.assert.text('flash_msg', 'You are registered and can now log in');
    });
    });
  });

});
