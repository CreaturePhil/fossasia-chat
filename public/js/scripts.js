$(function() {
  var socket = io();

  var $window = $(window);
  var $messages = $('.messages');
  var $inputMessage = $('.inputMessage');
  var username;

  $messages.css('height', $window.outerHeight() - 76 + 'px');

  function addMessage(msg) {
    $messages.append($('<li>').text(msg));
    $messages.scrollTop($messages[0].scrollHeight);
  }

  $window.on('keydown', function(e) {
    var message = $inputMessage.val();
    if (e.which === 13 && message) {
      $inputMessage.val('');
      if (message.charAt(0) === '/') {
        if (message.substr(1, 8).toLowerCase() === 'username' && message.substr(10)) {
          return socket.emit('change username', message);
        }
        addMessage('Command does not exist.');
      } else {
        socket.emit('chat message', username + ': ' + message);
      }
    }
  });

  socket.on('chat message', function(msg) {
    addMessage(msg);
  });

  socket.on('user join', function(data) {
    username = data;
    addMessage(username + ' has joined.');
  });

  socket.on('change username', function(data) {
    username = data.new;
    addMessage(data.old + ' has change username to ' + username);
  });

  socket.on('user disconnect', function(data) {
    username = data;
    addMessage(username + ' has left.');
  });

});
