process.env.NODE_ENV = 'test';
var app = require('../../app');
var Browser = require('zombie');
var http = require('http');
var expect = require('chai').expect;
var server = http.createServer(app);
require('socket.io').listen(server);

var browser;

describe('', function() {

  beforeEach(function(done) {
    server.listen(3001);
    browser = new Browser({ site: "http://localhost:3001"});
    browser.visit('/', done);
  });

  afterEach(function(done) {
    server.close();
    done();
  });

  describe('chat feature', function() {
    it('has no requests to start with', function() {
      browser.assert.text('div.main', 'Global Code Network Welcome Ask for help Current requests:');
    });

    // it('initiates a chat between two people', function() {
    //   browser.pressButton('Ask for help');
    // });
  });

});
