$(function() {
  var socket = io();

  var $window = $(window);
  var $messages = $('.messages');
  var $inputMessage = $('.inputMessage');
  var username;

  $messages.css('height', $window.outerHeight() - 76 + 'px');

  $window.on('keydown', function(e) {
    if (e.which === 13 && $inputMessage.val()) {
      socket.emit('chat message', username + ': ' + $inputMessage.val());
      $inputMessage.val('');
    }
  });

  function addMessage(msg) {
    $messages.append($('<li>').text(msg));
    $messages.scrollTop($messages[0].scrollHeight);
  }

  socket.on('chat message', function(msg) {
    addMessage(msg);
  });

  socket.on('user join', function(data) {
    username = data;
    addMessage(username + ' has joined.');
  });

  socket.on('user disconnect', function(data) {
    username = data;
    addMessage(username + ' has left.');
  });

});
