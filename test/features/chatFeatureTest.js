process.env.NODE_ENV = 'test';
var app = require('../../app');
var Browser = require('zombie');
var expect = require('chai').expect;

var browser1, browser2;

describe('chat feature', function() {

  beforeEach(function(done) {
    browser1 = new Browser({ site: "http://localhost:3000"});
    browser2 = new Browser({ site: "http://localhost:3000"});
    done();
  });

  beforeEach(function(done) {
    browser1.visit('/', done);
  });

  beforeEach(function(done) {
    browser2.visit('/', done);
  });

  // describe('page load', function() {
    
    it('has no requests to start with', function() {
      expect(browser1.text()).to.contain('Currently no requests');
    });


    // it('initiates a chat between two people', function() {
    //   browser.pressButton('Ask for help');
    // });
  // });

});
