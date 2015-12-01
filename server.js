var express = require('express');
var Immutable = require('immutable');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var every = require('./lib/every');
var weather = require('./lib/weather');
var news = require('./lib/news');
var downloads = require('./lib/downloads');
var telly = require('./lib/telly');

app.set('port', 3000);
app.use('/', express.static(require('path').join(__dirname, 'public')));

app.get('/refresh', function(req,res) {
  io.emit('refresh', null);
  res.send("refreshing app");
});

http.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port'));
  var exec = require('child_process').exec;
  var cmd = 'chromium-browser http://localhost:' + app.get('port');
  cmd += " --kiosk --noerrdialogs --incognito";
  exec(cmd);
});

/////////////////////////////////////////////////////
var data = Immutable.Map();
var copy = data;

// Today's weather
every("5m", function() {
  weather.today().then(today => {
    copy = copy.set('weather', today);
  });
});

// Week's weather
// every("1h", function() {
//   weather.week().then(week => {
//     copy = copy.set('forecast', week);
//   })
// });

// News
// every("1h", function() {
//   news.headlines().then(headlines => {
//     copy = copy.set('news', headlines);
//   });
// });

// Downloads
every("5s", function() {
  downloads.current().then(current => {
    copy = copy.set('downloads', current ? Immutable.Map(current) : null);
  });
});

// Telly
every("5s", function() {
  telly.whatsOn().then(details => {
    copy = copy.set('telly', details ? Immutable.Map(details) : null);
  });
});

// Current date and time
every("1s", function() {
  var datetime = require('moment')();
  copy = copy.set('date', datetime.format('dddd, Do MMMM YYYY'));
  copy = copy.set('time', datetime.format('HH:mm'));
});

// Check for changes in data and push to client
every("1s", function() {
  if (!Immutable.is(data, copy)) {
    data = copy;
    io.emit('data', data);
  }
});

// Push data to new clients immediately
io.on('connection', () => {
  io.emit('data', data);
});
