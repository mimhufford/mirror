var request = require('request');

var feeds = [
  "http://feeds.bbci.co.uk/news/technology/rss.xml",
  "http://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
  "http://feeds.bbci.co.uk/news/rss.xml",
];

exports.headlines = function () {
  var headlines = [];

  return new Promise(function(resolve, reject) {
    Promise.all(generateRequests()).then(data => {
      for (var feed of data) {
        headlines = headlines.concat(feed.responseData.feed.entries.map(data => data.title));
      }

      headlines = headlines.map(title => {
        var start = title.substring(0, 5);
        if (start == "VIDEO" || start == "AUDIO") {
          return title.slice(7);
        } else {
          return title;
        }
      });
      resolve(headlines);
    });
  });
}

function generateRequests() {
  var requests = [];

  for (var feed of feeds) {
    var url = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=-1&q=' + feed;
    var req = new Promise(function(resolve, reject) {
      request({url: url, json: true}, function(err, res, data) {
        resolve(data);
      });
    });
    requests.push(req);
  }

  return requests;
}
