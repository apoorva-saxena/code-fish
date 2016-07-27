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
});
