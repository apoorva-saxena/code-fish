process.env.NODE_ENV = 'test';
var server = require('../../app');
var Browser = require('zombie');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var expect = require('chai').expect;

var browser;

describe('User profile', function() {

    beforeEach(function() {
        server.listen(3001);
        browser = new Browser({
            site: "http://localhost:3001"
        });
    });

    beforeEach(function(done) {
      browser.visit('/sessions/new', done);
    });

    afterEach(function() {
        mongoose.connection.db.dropDatabase();
        server.close();
    });

    describe('User not signed in', function() {
        it('has no My profile button', function() {
            expect(browser.text('.navigation')).to.not.contain('My profile');
        });
    });

    describe('User signed in', function() {

        beforeEach(function(done) {
            var newUser = new User({
                username: 'test',
                email: 'hello@hello.com',
                password: 'abcd123123'
            });
            newUser.save(done);
        });
        beforeEach(function(done) {
            console.log(User.find());
            browser.fill('username', 'test');
            browser.fill('password', 'abcd123123');
            browser.pressButton('Sign in', done);
        });

        it('has My profile button', function() {
            console.log("0000000000000000000000001");
            console.log(browser.html());
            expect(browser.text('.navigation')).to.contain('My profile');
        });

    });



});
