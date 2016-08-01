process.env.NODE_ENV = 'test';
var server = require('../../app');
var Browser = require('zombie');
var expect = require('chai').expect;

var browser1, browser2, browser3;

describe('chat feature', function() {

  beforeEach(function(done) {
    server.listen(3001);
    browser1 = new Browser({ site: "http://localhost:3001"});
    browser2 = new Browser({ site: "http://localhost:3001"});
    browser3 = new Browser({ site: "http://localhost:3001"});

    done();
  });

  beforeEach(function(done) {
    browser1.visit('/', done);
  });

  beforeEach(function(done) {
    browser2.visit('/', done);
  });

  beforeEach(function(done) {
    browser3.visit('/', done);
  });

  afterEach(function(done) {
    server.close();
    done();
  });

  describe('page load', function() {

    it('has no requests to start with', function() {
      expect(browser1.text('#homepage-container')).to.contain('Currently no requests');
    });

    it('allows user to send a request for help', function() {
      browser1.pressButton('GET HELP NOW');
      expect(browser1.text('#page-layout')).to.contain('What do you need help with');
    });

  });

  describe('help request sent', function() {

    beforeEach(function(done){
      browser1.pressButton('GET HELP NOW');
      browser1.fill('description', 'Javascript testing');
      browser1.pressButton('Submit', done);
    });

    it('shows waiting for someone message when help request made', function(done) {
      setTimeout(function() {
        expect(browser1.text('#page-layout')).to.contain('Waiting for someone');
        expect(browser2.text('#homepage-container')).to.contain('Javascript testing');
        done();
      },200);
    });

    it('displays the chat page for both browsers and removes button for browser 3', function(done) {
      expect(browser2.query('#messages')).not.to.exist;
      browser2.pressButton('Topic: Javascript testing');
      expect(browser2.query('#messages')).to.exist;
      setTimeout(function() {
        expect(browser1.query('#messages')).to.exist;
        expect(browser3.text('.bottom-bar')).to.not.contain('Topic: Javascript testing');
        done();
      },200);
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
