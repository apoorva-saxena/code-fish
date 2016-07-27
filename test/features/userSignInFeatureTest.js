process.env.NODE_ENV = 'test';
var app = require('../../app');
var User = require('../../models/user');
var Browser = require('zombie');
var http = require('http');
var server = http.createServer(app);
var mongoose = require('mongoose');



var browser;


describe('User visits login page', function() {

  beforeEach(function(done) {
    server.listen(3001);
    browser = new Browser({ site: "http://localhost:3001"});
    browser.visit('/users/signin', done);
  });
  afterEach(function(done) {
    mongoose.connection.db.dropDatabase();
    server.close(done);

  });

  describe("User can Signin", function() {
    beforeEach(function(done){
      var newUser = new User({
        username: "test1",
        email: "test1@test.com",
        password: "test123"
      });
      newUser.save();
      browser.fill('email', 'test1@test.com')
      .fill('password', 'test123')
      .pressButton('Sign in', done);
    });

    it('should be successful', function() {
      browser.assert('div', 'You are logged in');
    });
  });
});
