var request = require('request');
var moment = require('moment');
var id = "your-api-key";

exports.today = function() {
  var base = "http://api.openweathermap.org/data/2.5/weather?id=2638077&units=metric&APPID=";

  return new Promise(function(resolve, reject) {
    request({url: base+id, json: true}, function (error, response, weather) {
      var icon = weatherToIcon(weather.weather[0].id, moment.unix(weather.sys.sunset));
      var temp = Math.round(weather.main.temp);
      resolve({icon, temp});
    });
  });
}

exports.week = function() {
  var base = "http://api.openweathermap.org/data/2.5/forecast/daily?id=2638077&units=metric&cnt=7&APPID=";

  return new Promise(function(resolve, reject) {
    request({url: base+id, json: true}, function (error, response, weather) {
      resolve(weather);
    });
  });
}

function weatherToIcon(wid, sunset)
{
  var day = true;

  if (sunset)
    day = moment() < sunset;

  switch (wid) {
    case 200:
    case 201:
    case 202:
    case 230:
    case 231:
    case 232:
      return day ? "wi-day-storm-showers" : "wi-night-alt-storm-showers";

    case 210:
    case 211:
    case 212:
    case 221:
      return day ? "wi-day-lightning" : "wi-night-alt-lightning";

    case 500:
      return day ? "wi-day-showers" : "wi-night-alt-showers";
    case 501:
      return day ? "wi-day-rain" : "wi-night-rain";


    case 701:
    case 721:
      return day ? "wi-day-haze" : "wi-night-fog";

    case 800:
      return day ? "wi-day-sunny" : "wi-night-clear";

    case 801:
    case 802:
    case 803:
    case 804:
      return day ? "wi-day-cloudy" : "wi-night-alt-cloudy";

    default:
      console.log(wid);
      return "wi-alien";
  }
}
