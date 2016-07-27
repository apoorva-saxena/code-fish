(function(exports) {

var socket = io();

$('#content').html($('#intro-template').html());

$('#help-button').click(function() {
  $('#content').html($('#new-help-request-template').html());
  $('#help-request-form').submit(function(e) {
    e.preventDefault();
    socket.emit('host room', { requestDescription: $('#request-description').val() });
    $('#content').html($('#loading-template').html());
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

$('body').on('click', '.join-button', function() {
  socket.emit('join room', {roomID: $(this).text()});
  $('#content').html($('#chat-template').html());
});

socket.on('person joined', function(data){
  socket.roomID = data.roomID;
  $('#content').html($('#chat-template').html());
  $('#chatbox').submit(function(e){
    e.preventDefault();
    socket.emit('chat message', { roomID: data.roomID, message: $('#m').val()} );
    $('#m').val('');
  });
  socket.on('chat message', function(data){
    $('#messages').append($('<li>').text(data.message));
  });
});

exports.socket = socket;

})(this);
