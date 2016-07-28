var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var routes = require('./routes/index');
var users = require('./routes/users');
var exphbs = require('express-handlebars');

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('test', function() {
  port = 3001;
});

app.use('/', routes);
app.use('/users', users);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});

var rooms = [];

  io.on('connection', function(socket){

    socket.emit('update available rooms', {rooms: rooms});

    socket.on('host room', function(data) {
      var roomID = data.requestDescription;

      socket.join(roomID, function() {
        rooms.push(roomID);
        socket.emit('new room');
        socket.broadcast.emit('update available rooms', {rooms: rooms});
      });
      
    });

    socket.on('join room', function(data){
      socket.join(data.roomID);
      io.to(data.roomID).emit('person joined', {roomID: data.roomID});

      socket.broadcast.emit('update available rooms', {rooms: rooms});
    });

    socket.on('chat message', function(data) {
      io.to(data.roomID).emit('chat message', data);
    });

  });

module.exports = app;
