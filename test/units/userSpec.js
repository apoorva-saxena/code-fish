process.env.NODE_ENV = 'test';
var User = require('../../models/user');
var mongoose = require('mongoose');
var expect = require('chai').expect;
var sinon = require('sinon');

var user, user2;

describe('user', function() {

  before(function(){
    user = new User({
        _id: 1,
        username: 'testman',
        bio: 'i am test',
        password: 'password',
        email: 'test@icle.com',
        githubid: '123',
        firstname: 'test',
        lastname: 'man',
        image: 'test image',
        avatar: 'test avatar',
        kudos: 5,
        city: 'london',
        citiesContacted: ['bristol', 'beijing']
      }, {collection: 'users'});
      user.save();
  });

  describe('checking the user', function() {

    it('should return a username', function() {
      expect(user.username).to.equal('testman');
    });

    it('should return a bio', function() {
      expect(user.bio).to.equal('i am test');
    });

    it('should return an email', function() {
      expect(user.email).to.equal('test@icle.com');
    });

    it('should return a githubID', function() {
      expect(user.githubid).to.equal('123');
    });

    it('should return a first name', function() {
      expect(user.firstname).to.equal('test');
    });

    it('should return a last name', function() {
      expect(user.lastname).to.equal('man');
    });

    it('should return a image url', function() {
      expect(user.image).to.equal('test image');
    });

    it('should return a avatar url', function() {
      expect(user.avatar).to.equal('test avatar');
    });

    it('should return a kudos score', function() {
      expect(user.kudos).to.equal(5);
    });

    it('should return a city', function() {
      expect(user.city).to.equal('london');
    });

    it('should return contacted cities', function() {
      expect(user.citiesContacted).to.include('bristol');
    });

  });

  describe('createUser', function() {

    it('should change the password to a has before saving', function() {
      user2 = new User({
          username: 'testman2',
          bio: 'i am test2',
          password: 'password',
          email: 'test2@icle.com',
        }, {collection: 'users'});
          User.createUser(user2, function() {
            expect(user2.password).not.to.equal('password');
          });
    });

  });

  describe('getUserByUsername', function() {
    it('should find the user by Username', function() {
      var foundUser = User.getUserByUsername('testman', function() {
        expect(foundUser).to.equal(user);
      });
    });
  });

  describe('getUserById', function() {
    it('should find the user by Id', function() {
      var foundUser2 = User.getUserById(1, function() {
        expect(foundUser2).to.equal(user);
      });
    });
  });

  describe('compare password', function() {
    it('should check the password', function() {
      var wasSuccess = User.comparePassword('password', user2.password, function() {
        expect(wasSuccess).to.equal(true);
      });
    });
  });

});
