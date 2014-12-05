var express = require('express')
var path = require('path');
var morgan = require('morgan');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// turn on console logging
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index', { title: 'Fossasia Chat' });
});

/// catch 404 and handle errors
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;
  res.status(err.status || 500);

  res.render('error', {
    title: 'Page not found',
    message: err.message,
    error: err
  });
});

var users = {};
var numUsers = 0;
var oldUsername = '';

io.on('connection', function(socket) {

  numUsers += 1;
  var name = 'Guest ' + numUsers;
  io.emit('user join', name);
  socket.username = name;
  users[socket.username] = { username: socket.username, socket: socket };

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });

  socket.on('change username', function(username) {
    delete users[socket.username];
    oldUsername = socket.username;
    socket.username = username.split(' ')[1];
    users[username] = { username: username, socket: socket };
    io.emit('change username', { old: oldUsername, new: socket.username });
  });

  socket.on('private message', function(req) {
    users[req.to].socket.emit('recieve pm', req);
  });

  socket.on('disconnect', function() {
    delete users[socket.username];
    numUsers--;
    io.emit('user left', socket.username);
  });

});

http.listen(3000, function() {
  console.log('listening on http://localhost:3000');
});
