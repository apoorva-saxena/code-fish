process.env.NODE_ENV = 'test';
// var app = require('../../app').listen(3001);
var User = require('../../models/user');
var Browser = require('zombie');
var mongoose = require('mongoose');
var expect = require('chai').expect;
var browser = new Browser({ site: "http://localhost:3001"});
var browser2 = new Browser({ site: "http://localhost:3001"});

describe('Chat features', function() {

  before(function(done) {
    this.timeout(10000);
    browser.visit('/users/new', function() {
      browser.fill('username', 'testusername');
      browser.fill('email', 'test@email.com');
      browser.fill('password', 'testpassword');
      browser.fill('passwordconfirmation', 'testpassword');
      browser.pressButton('Sign Up', function() {
        done();
      });
    });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase();
    done();
  });

  describe('can click ask for help',function() {
    //
    it('has an ask for help button', function(){
      expect(browser.html()).to.contain('Cast a line');
    });
    //
    it('can click ask for help and go to create room page', function(done){
      browser.pressButton('Cast a line').then(function() {
        expect(browser.html()).to.contain('I would like help with...');
      }).then(done, done);
    });
  });

  describe('getting help', function() {

    it('can fill in issue and go to wait page', function(done){
      browser.fill('description', 'Ruby help');
      browser.pressButton('Submit', function() {
        browser.assert.text('#loading-image-text', 'Waiting for a Code Coach to respond to your request...');
        done();
      });
    });

    it('second user can see the chat room', function(done) {
      browser2.visit('/', function() {
        browser2.assert.text('#join-rooms', 'Topic: Ruby help');
        done();
      });
    });
  });

});
