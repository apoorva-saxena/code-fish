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
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

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
// var profiles = require('./routes/profiles');

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

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);
app.use('/sessions', sessions);
// app.use('/profiles', profiles);

// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


io.on('connection', function(socket){

  socket.emit('update available rooms', {rooms: filteredRooms(socket)});

  socket.on('host room', function(data) {
    var roomID = 'Topic: ' + data.requestDescription;

    socket.join(roomID, function() {
      socket.emit('new room');
      socket.broadcast.emit('update available rooms', {rooms: filteredRooms(socket)});
    });

  });

  socket.on('join room', function(data){
    socket.join(data.roomID);
    io.to(data.roomID).emit('person joined', {roomID: data.roomID});
    socket.broadcast.emit('update available rooms', {rooms: filteredRooms(socket)});
  });

  socket.on('chat message', function(data) {
    io.to(data.roomID).emit('chat message', data);

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
