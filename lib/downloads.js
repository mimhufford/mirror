var Transmission = require('transmission');
var transmission = new Transmission({host:"192.168.1.1"});

exports.current = function() {
  return new Promise(function(resolve, reject) {
    transmission.get((err,data) => {
      if (err) {
        resolve();
      } else {
        // include only active ones (where there is something left to download)
        var active = data.torrents.filter(item => item.leftUntilDone != 0);
        if (active.length !== 0) {
          var downloads = {};
          downloads.count = active.length;
          var sizes = active.map(item => item.totalSize);
          var dones = active.map(item => item.haveValid);
          var totalSize = sizes.reduce((p,c) => p+c);
          var totalDone = dones.reduce((p,c) => p+c);
          downloads.percent = Math.round(totalDone / totalSize * 100);
          resolve(downloads);
        } else {
          resolve();
        }
      }
    });
  });
}
