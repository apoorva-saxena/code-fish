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
    console.log("=============1")
    server.listen(3001);
    browser = new Browser({ site: "http://localhost:3001"});
    browser.visit('/users/signin', done);
    console.log("==============2")
  });
  afterEach(function(done) {
    // mongoose.connection.db.dropDatabase();
    server.close(done);
  });

  describe("User can Signin", function() {
    beforeEach(function(done){
      console.log('==============3')
      var newUser = new User({
        username: "test1",
        email: "test1@test.com",
        password: "test123"
      });
      console.log('================4')
      console.log(newUser);
      newUser.save();

      console.log('=================5')
      browser.fill('email', 'test1@test.com')
      .fill('password', 'test123')
      .pressButton('Sign in', done);
      console.log('===================6')
    });

    it('should be successful', function() {
      console.log("==================7")
      browser.assert.text('div', 'You are logged in');
      console.log("===================8")
    });
  });
});
