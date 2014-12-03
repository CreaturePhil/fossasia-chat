var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var morgan = require('morgan');

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
