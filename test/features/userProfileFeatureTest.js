process.env.NODE_ENV = 'test';
var server = require('../../app');
var Browser = require('zombie');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var expect = require('chai').expect;

var browser;

describe('User profile', function() {

    beforeEach(function() {
        browser = new Browser({
            site: "http://localhost:3001"
        });
    });

    afterEach(function() {
        mongoose.connection.db.dropDatabase();
    });

    describe('User not signed in', function() {
        it('has no My profile button', function(done) {
          browser.visit('/', function() {
            expect(browser.text('.navigation')).to.not.contain('View profile');
            done();
            });
        });
    });

        it('has View profile button', function(done) {
          this.timeout(10000);
          browser.visit('/users/new', function() {
            browser.fill('username', 'testusername');
            browser.fill('email', 'test@email.com');
            browser.fill('password', 'testpassword');
            browser.fill('passwordconfirmation', 'testpassword');
            browser.pressButton('Sign Up', function() {
              expect(browser.html()).to.contain('MY PROFILE');
              done();
            });
          });

        });
});
