process.env.NODE_ENV = 'test';

var User = require('../../models/user');
var Browser = require('zombie');
var mongoose = require('mongoose');
var expect = require('chai').expect;
var browser2 = new Browser({ site: "http://localhost:3001"});

describe('User visits login page', function() {

  describe("User cannot Sign in with the wrong password", function(){

    it('user signs in when signed up', function(done){
      browser2.visit('/users/new', function() {
        browser2.fill('username', 'testusername2')
        .fill('email', 'test2@email.com')
        .fill('password', 'testpassword')
        .fill('passwordconfirmation', 'testpassword')
        .pressButton('Sign Up', function() {
          expect(browser2.html()).to.contain('Sign Out');
          done();
        });
      });
    });
  });

  describe("User can sign out", function(){
    it('user signs in when signed up', function(done){
      browser2.visit('/', function() {
        browser2.clickLink('Sign Out', function() {
          expect(browser2.html()).to.contain('Sign In');
          done();
        });
      });
    });
  });

  describe("User sign in", function(){

    it('fails with invalid username', function(done){
      browser2.visit('/', function() {
        browser2.clickLink('Sign In', function() {
          browser2.fill('username', 'testusernamesqsq')
          .fill('password', 'testpassword')
          .pressButton('Sign in', function() {
            expect(browser2.html()).to.contain('Unknown User');
            done();
          });
        });
      });
    });

    it('fails with invalid password', function(done){
      browser2.visit('/', function() {
        browser2.clickLink('Sign In', function() {
          browser2.fill('username', 'testusername2')
          .fill('password', 'fish')
          .pressButton('Sign in', function() {
            expect(browser2.html()).to.contain('Invalid password');
            done();
          });
        });
      });
    });


    it('user signs in when signed up', function(done){
      browser2.visit('/', function() {
        browser2.clickLink('Sign In', function() {
          browser2.fill('username', 'testusername2')
          .fill('password', 'testpassword')
          .pressButton('Sign in', function() {
            expect(browser2.html()).to.contain('Sign Out');
            done();
          });
        });
      });
    });
  });



//   describe("User cannot Sign in", function(){
//
//     beforeEach(function(done){
//       var newUser = new User({
//         username: "test1",
//         email: "test1@test.com",
//         password: "test123"
//       });
//       newUser.save();
//
//       browser.fill('username', 'wrongusername')
//       .fill('password', 'test123')
//       .pressButton('Sign In', done);
//     });
//
//     it('throw error if email and password does not match', function(){
//       expect(browser.text()).to.contain('Unknown User');
//     });
//   });
});
