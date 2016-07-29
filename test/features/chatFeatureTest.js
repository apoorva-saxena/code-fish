process.env.NODE_ENV = 'test';
var server = require('../../app');
var User = require('../../models/user');
var Browser = require('zombie');
var mongoose = require('mongoose');
var expect = require('chai').expect;

var browser1, browser2;


describe('chat feature', function() {

  beforeEach(function(done) {
    server.listen(3001);
    browser1 = new Browser({ site: "http://localhost:3001"});
    browser2 = new Browser({ site: "http://localhost:3001"});
    done();
  });

  beforeEach(function(done) {
    browser1.visit('/', done);
  });

  beforeEach(function(done) {
    browser2.visit('/', done);
  });

  afterEach(function(done) {
    mongoose.connection.db.dropDatabase();
    server.close(done);
  });


  describe('page load', function() {

    it('has no requests to start with', function() {
      expect(browser1.text('.bottom-bar')).to.contain('Currently no requests');
    });

  });

  describe('page load', function() {

    beforeEach(function(done) {
      var newUser = new User({
        username: "hello",
        email: "hello@hello.com",
        password: "fish"
      });
      newUser.save();

      browser1.visit('/sessions/new').then(function() {
      browser1.fill('username', 'hello')
      .fill('password', 'fish')
      .pressButton('Sign in');
      });
      done();
    });

    beforeEach(function(done){
      browser1.visit('/');
      done();
    });

    it('allows user to send a request for help', function() {
      console.log(browser1.html());
      browser1.pressButton('Ask for help').then(function(){
      expect(browser1.text('.main')).to.contain('What do you need help with');
     });
    });
  });



  describe('help request sent', function() {
    beforeEach(function(done){
      browser1.pressButton('Ask for help');
      browser1.fill('description', 'Javascript testing');
      browser1.pressButton('Submit', done);
    });

    it('shows waiting for someone message when help request made', function(done) {
      setTimeout(function() {
        expect(browser1.text('.main')).to.contain('Waiting for someone');
        expect(browser2.text('.bottom-bar')).to.contain('Javascript testing');
        done();
      },400);
    });

    it('displays the chat page for both browsers', function(done) {
      expect(browser2.query('#messages')).not.to.exist;
      browser2.pressButton('Javascript testing');
      expect(browser2.query('#messages')).to.exist;
      setTimeout(function() {
        expect(browser1.query('#messages')).to.exist;
        done();
      },400);
    });

    // describe("Chat page has been rendered", function() {
    //   beforeEach(function(done){
    //     browser2.pressButton('Javascript testing');
    //     browser2.fill('.chatbox-input', 'Hello');
    //     browser2.pressButton('Send', done);
    //   });
    //   it('sends chat messages between browsers', function(done) {
    //     expect(browser1.text('li')).to.contain('Hello');
    //     done();
    //   });
    // });
  });
});
