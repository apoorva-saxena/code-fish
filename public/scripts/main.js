(function(exports) {

var socket = io();


var currentUser;
var timeout;

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
    $(function() {
      $('#help-button').popupTooltip('bottom','Please sign in');
    });
   }
  });
  $('body').on('click', '.join-button', function() {
    if (data.user) {
      socket.emit('join room', { roomID: $(this).text(),
                                  mentorUsername: currentUser.username
                                });
    } else {
      $(function() {
        $('.join-button').popupTooltip('bottom','Please sign in');
      });
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
  var editor = CodeMirror.fromTextArea(document.getElementById("textit"), {
    mode: 'javascript',
    lineNumbers: true,
    theme: "ambiance"
  });

  socket.on('refresh', function (data) {
    editor.setValue(data.body);
  });
  socket.on('change', function (data) {
    console.log(data);
    editor.replaceRange(data.text, data.from, data.to);
  });
  editor.on('change', function (i, op) {
    console.log(op);
    socket.emit('change', op);
    socket.emit('refresh', editor.getValue());
  });


  $('#chatbox').submit(function(e){
    e.preventDefault();
    socket.emit('chat message', { roomID: data.roomID,
                                  message: $('#m').val(),
                                  username: currentUser.username
                                });
    $('#m').val('');
  });

  socket.on('chat message', function(data){

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

    if (data.username === currentUser.username) {
      $('#messages').append($('<li class="current-user-message">').html( '<span class="username">' + data.username + '</span>: ' + data.message));
    } else {
      $('#messages').append($('<li class="responding-user-message">').html( '<span class="username">' + data.username + '</span>: ' + data.message));
    }
  });

  function timeoutFunction() {
    typing = false;
    socket.emit('typing', {roomID: data.roomID, message: false});
  }


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

});

exports.socket = socket;
})(this);
