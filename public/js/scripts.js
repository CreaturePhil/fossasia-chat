$(function() {
  var socket = io();
  var $messageInput = $('#messageInput');

  $('#messageForm').on('submit', function(e) {
    e.preventDefault();
    socket.emit('chat message', $messageInput.val());
    $messageInput.val('');
  });

  socket.on('chat message', function(msg) {
    var message = '<tr><td>' + msg + '</td></tr>'; 
    $('#messages').append(message);
  });
});
