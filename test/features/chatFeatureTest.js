process.env.NODE_ENV = 'test';
var app = require('../../app');
var Browser = require('zombie');
var http = require('http');
var expect = require('chai').expect;
// var server = http.createServer(app);
// require('socket.io').listen(server);

var browser1;
var browser2;

describe('chat feature', function() {

  beforeEach(function(done) {
    // app.listen(3001);
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

  afterEach(function(done) {
    // server.close();
    done();
  });

  describe('page load', function() {
    it('has no requests to start with', function(done) {
      setTimeout(function(){


      expect(browser1.text()).to.contain('Currently no requests');
      done();
    },0);

    }) ;

    // it('initiates a chat between two people', function() {
    //   browser.pressButton('Ask for help');
    // });
  });

});
