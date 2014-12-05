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

io.on('connection', function(socket) {

  numUsers += 1;
  io.emit('user join', 'Guest ' + numUsers);

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });

  socket.on('add user', function(username) {
    socket.username = username; 

    user[username] = username;
    io.emit('user join', username);
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
