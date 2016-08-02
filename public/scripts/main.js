(function(exports) {

var socket = io();
var currentUser;
var timeout;
var User = require('../models/user');

$('#page-layout').html($('#homepage-template').html());

socket.on('current user', function(data) {
  currentUser = data.user;
  $('#help-button').click(function() {
    if (currentUser) {
      $('#page-layout').html($('#new-help-request-template').html());
      $('#help-request-form').submit(function(e) {
        e.preventDefault();
        socket.emit('host room', { requestDescription: $('#request-description').val(),
                                   mentee: currentUser
                                  });
        $('#page-layout').html($('#loading-template').html());
      });
    }
    else {
      $('#help-button').popupTooltip('bottom','Please sign in');
    }
  });
  $('body').on('click', '.join-button', function() {
    if (data.user) {
      socket.emit('join room', { roomID: $(this).text(),
                                  mentor: currentUser
                                });
    }
    else {
        $('.join-button').popupTooltip('bottom','Please sign in');
    }
  });
});

socket.on('update available rooms', function(data) {
  $('#join-rooms').empty();
  if (data.rooms.length > 0) {
    for (var i = 0 ; i < data.rooms.length ; i++) {
      $('#join-rooms').append('<button class="join-button">' + data.rooms[i] + '</button>');
    }
  }
  else {
    $('#join-rooms').html('<h4>There are currently no live requests</h4>');
  }
});

socket.on('new room', function(){
  $('#page-layout').html($('#loading-template').html());
});

socket.on('person joined', function(data){

  $('#page-layout').html($('#chat-template').html());

  $('#chatbox').submit(function(e){
    e.preventDefault();
    socket.emit('chat message', { roomID: data.roomID,
                                  message: $('#m').val(),
                                  user: currentUser
                                });
    $('#m').val('');
  });

  socket.on('chat message', function(data){
    if (data.user.username === currentUser.username) {
      $('#messages').append($('<li class="current-user-message">').html( '<span class="username">' + data.user.username + '</span>: ' + data.message));
    }
    else {
      $('#messages').append($('<li class="responding-user-message">').html( '<span class="username">' + data.user.username + '</span>: ' + data.message));
    }
  });

  $('.chatbox-input').keyup(function() {
    typing = true;
    socket.emit('typing', {roomID: data.roomID, message: 'typing...'});
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 1000);
  });

  socket.on('typing', function(data) {
    if (data) {
      $('.typing').html(data);
    } else {
      $('.typing').html("");
    }
  });

  function timeoutFunction() {
    typing = false;
    socket.emit('typing', {roomID: data.roomID, message: false});
  }

  $('#end-chat-button').click(function() {
    socket.emit('end chat', { roomID: data.roomID });
  });

  socket.on('mentee left', function(data) {
    $('#page-layout').html($('#end-chat-template').html());
    $('#other-username').text(data.mentee.username);
    console.log(data.mentee.kudos);
    $('.kudos-image').click(function() {
      User.update(
        { _id: data.mentee._id},
        {$inc: { data.mentee.kudos: 1}}
      );
      console.log(data.mentee.kudos);
    });

  });

  socket.on('mentor left', function(data) {
    $('#page-layout').html($('#end-chat-template').html());
    $('#other-username').text(data.mentor.username);
    $('.kudos-image').on('click', function() {

    });
  });


});

exports.socket = socket;
})(this);
