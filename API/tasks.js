module.exports = function() { 

    /**
    * Tasks
    */
    function _getFx(data){
        return new Promise((resolve, reject) => {
            setTimeout(function(){  
            console.log(data); 
            resolve('resolvedFromOne');
            }, 200);
        })
    }

    function _getPendingTransactions(task){
        return new Promise((resolve, reject) => {
            console.log('getHashtags', task);
        })
    };

    function _getHashtags(task){
        return new Promise((resolve, reject) => {
            console.log('getHashtags', task);
        })
    };
    function _getGasPrice(task){
        return new Promise((resolve, reject) => {
            console.log('getGasPrice', task);
        })
    };
    function _getHealth(task){
        return new Promise((resolve, reject) => {
            console.log('getHealth', task);
        })
    };
    function _getBalance(task){
        return new Promise((resolve, reject) => {
            console.log('getBalance', task);
        })
    };


}