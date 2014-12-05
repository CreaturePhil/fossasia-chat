$(function() {
  var socket = io();

  var $window = $(window);
  var $messages = $('.messages');
  var $inputMessage = $('.inputMessage');
  var username, pmUser;

  $messages.css('height', $window.outerHeight() - 76 + 'px');
  addMessage('Use /username [Put name here] to change your username.');

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
        socket.emit('chat message', message);
      }
    }
  });

  $('.messages').on('click', '.pm', function() {
    pmUser = $(this).data('username');
  });

  $('.pmSend').on('click', function() {
    var msg = $('.pmSend').closest('.modal-footer').prev().find('textarea');
    var req = {
      from: username,
      to: pmUser,
      message: msg.val()
    };
    msg.val('');
    socket.emit('private message', req);
  });

  socket.on('chat message', function(msg) {
    var dropdown = $('<li><div class="dropdown"> <a id="dLabel" data-target="#" href="#" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">' + username + ':</a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"><li><a href="javascript:void(0)" data-toggle="modal" data-target="#pm" class="pm" data-username="' + username + '">Private Message</a></li></ul> ' + $('<div>').text(msg).text() + '</div></li>');
    $messages.append(dropdown);
    $messages.scrollTop($messages[0].scrollHeight);
  });

  socket.on('recieve pm', function(req) {
    addMessage(req.from + ' says: ' + req.message); 
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
