(function(exports) {

var socket = io();


var currentUser;

$('#page-layout').html($('#homepage-template').html());

socket.on('current user', function(data) {
  currentUser = data.user;
  $('#help-button').click(function() {
    if (currentUser) {
      $('#page-layout').html($('#new-help-request-template').html());
      $('#help-request-form').submit(function(e) {
      e.preventDefault();
      socket.emit('host room', { requestDescription: $('#request-description').val(),
                                 menteeUsername: currentUser.username
                               });
      $('#page-layout').html($('#loading-template').html());
    });
  } else {
  console.log('Please sign in');
   }
  });
  $('body').on('click', '.join-button', function() {
    if (data.user) {
      socket.emit('join room', { roomID: $(this).text(),
                                  mentorUsername: currentUser.username
                                });
    } else {
      console.log('Please sign in to join room');
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
                                  username: currentUser.username
                                });
    $('#m').val('');
  });

  socket.on('chat message', function(data){
    $('#messages').append($('<li>').text(data.username + ': ' + data.message));
  });

  $('#end-chat-button').click(function() {
    socket.emit('end chat', { roomID: data.roomID });
  });

  socket.on('mentee left', function(data) {
    $('#page-layout').html($('#end-chat-template').html());
    $('#other-username').text(data.menteeUsername);
  });

  socket.on('mentor left', function(data) {
    $('#page-layout').html($('#end-chat-template').html());
    $('#other-username').text(data.mentorUsername);
  });

});

exports.socket = socket;
})(this);
