var request = require('request');
var moment  = require('moment');

var base    = 'http://192.168.1.1/jsonrpc?request={"jsonrpc":"2.0","id":"1","method":';
var current = '"Player.GetItem",      "params":{"playerid":1,"properties":["showtitle","season","episode"]}}';
var times   = '"Player.GetProperties","params":{"playerid":1,"properties":["totaltime","time"]}}';

exports.whatsOn = function() {
  return new Promise(function(resolve, reject) {
    request({url:base+current, timeout:1000}, function(err, response, body) {
      if (err) { resolve(); return; } // pi not reachable after 1s? fuck it, it's probably off

      var data = JSON.parse(body).result.item;
      if (data.label) { // if something is playing
        var details = {};
        details.title = data.label;

        if (data.type === "episode") {
          details.show = data.showtitle;
          details.season = data.season;
          details.episode = data.episode;
        }

        request({url:base+times, timeout:1000}, function(err, response, body) {
          if (err) { resolve(); return; } // pi not reachable after 1s? fuck it, it's probably off

          var data = JSON.parse(body).result;
          var pos = data.time.hours      * 3600000 + data.time.minutes      * 60000 + data.time.seconds      * 1000 + data.time.milliseconds;
          var tot = data.totaltime.hours * 3600000 + data.totaltime.minutes * 60000 + data.totaltime.seconds * 1000 + data.totaltime.milliseconds;

          // get finish time
          details.finishes =  moment.unix(moment().unix()+(tot-pos)/1000).format("HH:mm");

          resolve(details);
        });
      } else { // nothing is playing
        resolve();
      }
    });
  });
}
