var socket = io();

$('#request-form').submit(function(){
    console.log('before called host room');
  socket.emit('host room', { description: $('#request-description').val() });
  console.log('after called host room');
});



$('#chatbox').submit(function(){
  socket.emit('chat message', $('#m').val());
$('#m').val('');
  return false;
});
socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});

// $(document).ready(function(){
//     $('.rooms').append('<li> test </li>');
// });

socket.on('new room', function(data){
  console.log(data.roomID);
  console.log('appending string process running');
  $('#rooms').append($('<li>').text(data.description));
});

socket.on('update available rooms', function(data) {
  console.log(data);
  for (var i = 0 ; i < data.rooms.length;i++){
    currentRoom = data.rooms[i];
    console.log(currentRoom.sockets);
    $('#rooms').append($('<li>').text(currentRoom.sockets));
  }
});
