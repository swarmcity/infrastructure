module.exports = function(web3) {

const ipfs = require('../js-ipfs-api.js');

return ({

_setAvatar: function(base64) {

  return new Promise((resolve, reject) => {

    ipfs.add(base64, function(err, res) {
      //if (cb) cb(err, res);
      resolve(res);
    });

  });
},

_getAvatar: function(hash) {

  return new Promise((resolve, reject) => {

    ipfs.cat(hash, function(err, res) {
      var buf = "";
      if (err) {
        resolve(err);
      }
      res
        .on('error', function(err) {
          throw (err);
        })
        .on('data', function(data) {
          buf += data;
        })
        .on('end', function() {
          //return cb(null, buf);
          resolve(buf);
        });
    });

  });
}


});

}
