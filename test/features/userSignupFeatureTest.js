process.env.NODE_ENV = 'test';

// var server = require('../../app');
var User = require('../../models/user');
var Browser = require('zombie');
var mongoose = require('mongoose');
var expect = require('chai').expect;
var browser = new Browser({ site: "http://localhost:3001"});


describe('User visits signup page', function() {

  describe('Should see the signup page', function() {
    it('Should see sign up', function(done) {
      browser.visit('/users/new', function() {
        expect(browser.html()).to.contain('Sign up to get help now!');
        done();
      });
    });
  });

  describe('successful sign up', function() {

    it('successful when all details entered correctly', function(done) {
      browser.fill('username', 'testusername')
      .fill('email', 'test@email.com')
      .fill('password', 'testpassword')
      .fill('passwordconfirmation', 'testpassword')
      .pressButton('Sign Up', function() {
        expect(browser.html()).to.contain('SIGN OUT');
        done();
      });
    });
  });
});
