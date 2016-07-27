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

  describe('successful sign up', function() {

    beforeEach(function(done) {
      browser.fill('username', 'testusername')
      .fill('email', 'test@email.com')
      .fill('password', 'testpassword')
      .fill('passwordconfirmation', 'testpassword')
      .pressButton('Sign Up', done);
    });

    it('successful when all details entered correctly', function() {
      browser.assert.text('div.flash_msg', 'You are registered and can now log in');
    });

  });

  describe('unsuccessful sign up', function() {

    beforeEach(function(done) {
      browser.fill('username', '')
      .fill('email', 'test@email.com')
      .fill('password', 'testpassword')
      .fill('passwordconfirmation', 'testpassword')
      .pressButton('Sign Up', done);
    });

    it('error when username is missing', function() {
      browser.assert.text('div.flash_msg', 'Username is required');
    });

  });

  describe('unsuccessful sign up', function() {

    beforeEach(function(done) {
      browser.fill('username', 'testusername')
      .fill('email', '')
      .fill('password', 'testpassword')
      .fill('passwordconfirmation', 'testpassword')
      .pressButton('Sign Up', done);
    });

    it('error when email is missing', function() {
      browser.assert.text('div.flash_msg', 'Email is required Email is not valid');
    });

  });

  describe('unsuccessful sign up', function() {

    beforeEach(function(done) {
      browser.fill('username', 'testusername')
      .fill('email', 'hello')
      .fill('password', 'testpassword')
      .fill('passwordconfirmation', 'testpassword')
      .pressButton('Sign Up', done);
    });

    it('error when email is invalid', function() {
      browser.assert.text('div.flash_msg', 'Email is not valid');
    });

  });

  describe('unsuccessful sign up', function() {

    beforeEach(function(done) {
      browser.fill('username', 'testusername')
      .fill('email', 'test@email.com')
      .fill('password', '')
      .fill('passwordconfirmation', '')
      .pressButton('Sign Up', done);
    });

    it('error when password is missing', function() {
      browser.assert.text('div.flash_msg', 'Password is required');
    });

  });

  describe('unsuccessful sign up', function() {

    beforeEach(function(done) {
      browser.fill('username', 'testusername')
      .fill('email', 'test@email.com')
      .fill('password', 'testpassword')
      .fill('passwordconfirmation', 'failure')
      .pressButton('Sign Up', done);
    });

    it('error when passwords do not match', function() {
      browser.assert.text('div.flash_msg', 'Passwords do not match');
    });

  });

});
