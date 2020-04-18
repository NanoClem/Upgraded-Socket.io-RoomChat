const redis = require('redis');
const client = redis.createClient();


/**
 * Get all elements in a list
 * @param {string} key key value of the list in redis
 */
var getList = function (key, fn) {
    client.lrange(key, 0, -1, function (err, res) {
        fn(res);
    });
}

/**
 * Add element to list in redis
 * @param {string} key key value of the list in redis
 * @param {string} elem element to add
 */
var addElementTo = function(key, elem) {
    client.rpush([key, JSON.stringify(elem)], function (err, res) {
        console.log(err);
    });
}

/**
 * Remove element from a list in redis
 * @param {string} key key value of the list in redis
 * @param {string} elem element to remove
 */
var removeElementFrom = function (key, elem) {
    client.lrem([key, 0, JSON.stringify(elem)], function (err, res) {
        // do something on delete
    });
}


// EXPORTS
module.exports = {
    Rclient : client,
    getList : getList,
    addElementTo : addElementTo,
    removeElementFrom : removeElementFrom
};