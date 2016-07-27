process.env.NODE_ENV = 'test';
var app = require('../../app');

var Browser = require('zombie');
var http = require('http');
var server = http.createServer(app);
var mongoose = require('mongoose');



var browser;


describe('User visits signup page', function() {

  beforeEach(function(done) {
    server.listen(3001);
    browser = new Browser({ site: "http://localhost:3001"});
    browser.visit('/users/signup', done);
  });
  afterEach(function(done) {
    mongoose.connection.db.dropDatabase();
    server.close(done);

  });

  describe('Should see the signup page', function() {
    it('Should see sign up', function() {
      browser.assert.text('h2', 'Sign up');
    });
  });

  describe('successful sign up', function() {

    beforeEach(function(done) {
      browser.fill('username', 'testusername')
      .fill('email', 'test@email.com')
      .fill('password', 'testpassword')
      .fill('passwordconfirmation', 'testpassword')
      .pressButton('Sign Up', done);
    });

    it('successful when all details entered correctly', function() {
      browser.assert.text('div.flash_msg', 'You are registered and can now log in');
    });
  });

});
