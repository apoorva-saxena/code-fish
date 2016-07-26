var socket = io();

$('#request-form').submit(function(){
  socket.emit('host room', { description: $('#request-description').val() });
});



$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
$('#m').val('');
  return false;
});
socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});
