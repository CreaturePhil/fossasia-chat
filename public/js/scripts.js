$(function() {
  var socket = io();

  var $window = $(window);
  var $messages = $('.messages');
  var $inputMessage = $('.inputMessage');

  $messages.css('height', $window.outerHeight() - 76 + 'px');

  $window.on('keydown', function(e) {
    if (e.which === 13 && $inputMessage.val()) {
      socket.emit('chat message', $inputMessage.val());
      $inputMessage.val('');
    }
  });

  socket.on('chat message', function(msg) {
    $messages.append($('<li>').text(msg));
    $messages.scrollTop($messages[0].scrollHeight);
  });

});
