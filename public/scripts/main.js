(function(exports) {

var socket = io();
var currentUser;
var timeout;


var imgAr = ['fish1.png','fish2.png','fish3.png','fish5.png','fish6.png','fish7.png','fish4.png'];

function getRandomImage(imgAr, path) {
    path = path || './images/fish/'; // default path here
    var num = Math.floor( Math.random() * imgAr.length );
    var img = imgAr[ num ];
    var imgStr =  path + img;
    return imgStr;
}

$('#page-layout').html($('#homepage-template').html());

socket.on('current user', function(data) {
  currentUser = data.user;
  $('#help-button').click(function() {
    if (currentUser) {
      $('#page-layout').html($('#new-help-request-template').html());

      $('#help-request-form').submit(function(e) {

      e.preventDefault();
      socket.emit('host room', { requestDescription: $('#request-description').val(),
                                languages: $('#languages').val(),
                                 mentee: currentUser
                               });
      $('#page-layout').html($('#loading-template').html());
    });
  } else {
      $('#help-button').popupTooltip('bottom','Please sign in');
    }
  });
  $('body').on('click', '#join-button', function() {
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
  $('#join-rooms-full').empty();
  if (data.rooms.length > 0) {
    $('#join-rooms-full').append('<div class="row">');
    for (var i = 0 ; i < data.rooms.length ; i++) {
      $('#join-rooms-full').append('<div class="col-xs-4 col-md-3"><a href="#" class="thumbnail"><img src=' + getRandomImage(imgAr) +'></a> <div class="caption"> <button class="btn btn-secondary" id="join-button">' + data.rooms[i] + '</button></div></div>');

    }
    $('#join-rooms-full').append('</div>');
  }
  else {
    $('#join-rooms-empty').html('<h4 id=empty-requests-text>There are no live requests</h4> <img id="empty-fish-img" src="./images/fishbone.png" />');
  }
});

socket.on('new room', function(){
  $('#page-layout').html($('#loading-template').html());
});

socket.on('person joined', function(data){

  $('#page-layout').html($('#chat-template').html());
  var editor = CodeMirror.fromTextArea(document.getElementById("textit"), {
    mode: data.languageSelected,
    lineNumbers: true,
    theme: "ambiance"
  });

  socket.on('refresh', function (data) {
    editor.setValue(data.body);
  });
  socket.on('change', function (data) {
    editor.replaceRange(data.text, data.from, data.to);
  });
  editor.on('change', function (i, op) {
    socket.emit('change', op);
    socket.emit('refresh', editor.getValue());
  });

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
    socket.emit('update cities contacted for mentor', { mentor: data.mentor, menteeCity: data.mentee.city } );
    $('.kudos-image').on('click', function() {
      socket.emit('update mentee kudos', data );
      $('#page-layout').html($('#thank-you-template').html());
    });
  });

  socket.on('mentor left', function(data) {
    $('#page-layout').html($('#end-chat-template').html());
    $('#other-username').text(data.mentor.username);
    socket.emit('update cities contacted for mentee', { mentee: data.mentee, mentorCity: data.mentor.city } );
    $('.kudos-image').on('click', function() {
      socket.emit('update mentor kudos', data );
      $('#page-layout').html($('#thank-you-template').html());
    });
  });


});

exports.socket = socket;
})(this);
