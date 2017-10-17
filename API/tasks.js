const logs = require('./logs.js')();

module.exports = function(web3){

const getBalance = require('./tasks/getBalance.js')(web3);
const getFx = require('./tasks/getFx.js')(web3);
var a = 0;

return {
  /**
  * Tasks
  */
  _getFx: function(queue, task){
    return getFx._getFx(task.publicKey).then((res) => {
      task.socket.emit('fxChanged', res);
      queue(task, "remove");
      return res;
    }).catch((err) => { console.log('get fx ERR! ', err)});
  },

  _getBalance: function(queue, task){
    return getBalance._getBalance(task.publicKey).then((res) => {
      task.socket.emit('balanceChanged', res);
      queue(task, "remove");
      return res;
    }).catch((err) => { console.log('get balance ERR! ', err)});
  },

  _getHashtags: function(queue, task){
    return new Promise((resolve, reject) => {
      // dummy hashtagslist
      console.log('=========== GET HASHTAGS ============');
      resolve('getHashtags');
    })
  },

  _getGasPrice: function(queue, task){
    return new Promise((resolve, reject) => {
      // get gas price
      console.log('=========== GET GAS PRICE ============');
      resolve('getGasPrice');
    })
  },

  _getHealth: function(queue, task){
    return new Promise((resolve, reject) => {
      console.log('=========== GET HEALTH ============');
      resolve('getHealth');
    })
  },

  _getPendingTransactions: function(queue, task){
    return new Promise((resolve, reject) => {
      // get pending tx
      resolve('getPendingTransactions');
    })
  }



}

};
