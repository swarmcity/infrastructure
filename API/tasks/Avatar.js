// TODO: Rename this file to lowecaseavata.js
module.exports = function(web3) {
  return ({
    /**
		* Get Heath
		* @param {String} base64 
		* @return {Array} 
		*/
    _setAvatar: function(base64) {
      return new Promise((resolve, reject) => {
        // TODO: Send the image to the /Store container 
        // ipfs.add(base64, function(err, res) {
        //   resolve(res);
        // });
      });
    },
		/**
		* Get Heath
		* @param {String} hash 
		* @return {Array} 
		*/
    _getAvatar: function(hash) {
      return new Promise((resolve, reject) => {
        // TODO: Send the image to the /Store container 
        // ipfs.cat(hash, function(err, res) {
        //   let buf = '';
        //   if (err) {
        //     resolve(err);
        //   }
        //   res
        //     .on('error', function(err) {
        //       throw (err);
        //     })
        //     .on('data', function(data) {
        //       buf += data;
        //     })
        //     .on('end', function() {
        //       resolve(buf);
        //     });
        // });
      });
    },
  });
};
