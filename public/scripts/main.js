(function(exports) {

var socket = io();


var currentUser;

$('#content').html($('#intro-template').html());
socket.on('current user', function(data) {
  currentUser = data.user;
  $('#help-button').click(function() {
    if (currentUser) {
    $('#content').html($('#new-help-request-template').html());

    $('#help-request-form').submit(function(e) {
      e.preventDefault();
      socket.emit('host room', { requestDescription: $('#request-description').val() });
      $('#content').html($('#loading-template').html());
    });
  } else {
  console.log('Please sign in');
   }
  });
  $('body').on('click', '.join-button', function() {
    if (data.user) {
      socket.emit('join room', {roomID: $(this).text()});
      $('.bottom-bar').remove();
      $('#content').html($('#chat-template').html());
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
    $('#join-rooms').html('<p>Currently no requests</p>');
  }
});

socket.on('new room', function(){
  $('#content').html($('#loading-template').html());
});



socket.on('person joined', function(data){
  $('.bottom-bar').remove();
  $('#content').html($('#chat-template').html());
  $('#chatbox').submit(function(e){
    e.preventDefault();
    socket.emit('chat message', { roomID: data.roomID, message: $('#m').val(), username: currentUser.username});
    $('#m').val('');
  });

  socket.on('chat message', function(data){
    $('#messages').append($('<li>').text( data.username + ': ' + data.message));
  });
});

exports.socket = socket;
})(this);
