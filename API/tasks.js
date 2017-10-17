module.exports = function(_eventLog) { return {
/**
* Tasks
*/
_getFx: function(data){
    return new Promise((resolve, reject) => {
        console.log('=========== GET FX ============');
        _eventLog('test', 'hi there');
        resolve('getFx');
    })
},

_getHashtags: function(task){
    return new Promise((resolve, reject) => {
        console.log('=========== GET HASHTAGS ============');
        resolve('getFx');
    })
},

_getGasPrice: function(task){
    return new Promise((resolve, reject) => {
        console.log('=========== GET GAS PRICE ============');
        resolve('getFx');
    })
},

_getHealth: function(task){
    return new Promise((resolve, reject) => {
        console.log('=========== GET HEALTH ============');
        resolve('getFx');
    })
},

_getPendingTransactions: function(task){
    return new Promise((resolve, reject) => {
        resolve('getFx');
    })
},

_getBalance: function(task){
    return new Promise((resolve, reject) => {
        resolve('getFx');
    })
}

}

}
