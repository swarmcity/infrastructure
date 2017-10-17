const logs = require('./logs.js')();

module.exports = function(web3){

const getBalance = require('./tasks/getBalance.js')(web3);

return {

  /**
  * Tasks
  */
  _getFx: function(data){
    return new Promise((resolve, reject) => {
      console.log('=========== GET FX ============');
      // conversion to xx coinmarket cap API
      logs._eventLog('test', 'hi there');
      resolve('getFx');
    })
  },

  _getHashtags: function(queue, task){
    return new Promise((resolve, reject) => {
      // dummy hashtagslist
      console.log('=========== GET HASHTAGS ============');
      resolve('getFx');
    })
  },

  _getGasPrice: function(queue, task){
    return new Promise((resolve, reject) => {
      // get gas price
      console.log('=========== GET GAS PRICE ============');
      resolve('getFx');
    })
  },

  _getHealth: function(queue, task){
    return new Promise((resolve, reject) => {
      console.log('=========== GET HEALTH ============');
      resolve('getFx');
    })
  },

  _getPendingTransactions: function(queue, task){
    return new Promise((resolve, reject) => {
      // get pending tx
      resolve('getFx');
    })
  },

  _getBalance: function(queue, task){
    return getBalance._getBalance(task.publicKey).then((res) => {
      task.socket.emit('balanceChanged', res);
      queue(task, "remove");
      return res;
    }).catch((err) => { console.log('get balance ERR! ', err)});
  }

}

};
