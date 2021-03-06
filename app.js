var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var flash = require('express-flash');
var expressValidator = require('express-validator');
var session = require('express-session');
var exphbs = require('express-handlebars');
var app = express();
var config = require('./_config');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var User = require('./models/user');


var socks = [];
var body = "";
var languageSelected = "";

mongoose.connect(config.mongoURI[app.settings.env], function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
  }
});

var db = mongoose.connection;

var routes = require('./routes/index');
var sessions = require('./routes/sessions');
var users = require('./routes/users');

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
var currentUser;
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  currentUser = req.user;
  next();
});


app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
  });

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.use('/', routes);
app.use('/users', users);
app.use('/sessions', sessions);

io.on('connection', function(socket){

  socks.push(socket);
  socket.emit('refresh', {body: body});

  socket.on('refresh', function (body_) {
    body = body_;
  });

  socket.on('change', function (op) {
  if (op.origin == '+input' || op.origin == 'paste' || op.origin == '+delete') {
    socks.forEach(function (sock) {
      if (sock != socket)
        sock.emit('change', op);
    });
  }
});


  socket.emit('current user', {user: currentUser});
  socket.emit('update available rooms', {rooms: filteredRooms(socket)});


  socket.on('host room', function(data) {
    var roomID = 'Topic: ' + data.requestDescription;
    languageSelected = data.languages;

    socket.join(roomID, function() {
      socket.emit('new room');

      var helpRequest = {
        id: roomID,
        language: languageSelected,
        menteeSocket: socket,
        mentee: data.mentee

      };

      findRoom(socket, roomID).helpRequest = helpRequest;

      socket.broadcast.emit('update available rooms', {rooms: filteredRooms(socket)});
    });

  });

  socket.on('join room', function(data){
    socket.join(data.roomID);
    io.to(data.roomID).emit('person joined', {roomID: data.roomID, languageSelected: languageSelected});
    socket.broadcast.emit('update available rooms', {rooms: filteredRooms(socket)});

    findRoom(socket, data.roomID).helpRequest.mentor = data.mentor;
    findRoom(socket, data.roomID).helpRequest.mentorSocket = socket;
  });

  socket.on('chat message', function(data) {
    io.to(data.roomID).emit('chat message', data);
  });

  socket.on('end chat', function(data) {
    var menteeSocket = findRoom(socket, data.roomID).helpRequest.menteeSocket;
    var mentorSocket = findRoom(socket, data.roomID).helpRequest.mentorSocket;
    var mentee = findRoom(socket, data.roomID).helpRequest.mentee;
    var mentor = findRoom(socket, data.roomID).helpRequest.mentor;

    io.to(mentorSocket.id).emit('mentee left', { mentee: mentee, mentor: mentor });
    io.to(menteeSocket.id).emit('mentor left', { mentor: mentor, mentee: mentee });
    menteeSocket.leave(data.roomID);
    mentorSocket.leave(data.roomID);
  });

  socket.on('typing', function (data) {
    socket.broadcast.to(data.roomID).emit('typing', data.message);
   });

  socket.on('update mentee kudos', function(data) {
    User.findOne({ _id: data.mentee._id }, function(err, user) {
      if (err) { return (err) };
      user.kudos += 1;
      user.save();
    });
  });

  socket.on('update mentor kudos', function(data) {
    User.findOne({ _id: data.mentor._id }, function(err, user) {
      if (err) { return (err) };
      user.kudos += 1;
      user.save();
    });
  });

  socket.on('update cities contacted for mentor', function(data) {
    User.findOne({ _id: data.mentor._id }, function(err, user) {
      if (err) { return (err) };
      user.citiesContacted.push(data.menteeCity);
      user.save();
      console.log(user);
    });
  });

  socket.on('update cities contacted for mentee', function(data) {
    User.findOne({ _id: data.mentee._id }, function(err, user) {
      if (err) { return (err) };
      user.citiesContacted.push(data.mentorCity);
      user.save();
      console.log(user);
    });
  });

});

//helper methods

function findRoom(socket, roomID){
  return socket.adapter.rooms[roomID];
}

function filteredRooms(socket){
  var rooms = [];
  for (var room in socket.adapter.rooms){
    if (room.match(/^Topic/) && findRoom(socket, room).length < 2){
      rooms.push(room);
    }
  }
  return rooms;
}

module.exports = http;
