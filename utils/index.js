const redis = require('redis');
const client = redis.createClient();


/*============================================================
    REDIS UTILS
==============================================================*/

/**
 * Get all elements in a list
 * @param {string} key key value of the list in redis
 */
var getList = function (key, fn) {
    client.lrange(key, 0, -1, function (err, res) {
        if (err) throw err;
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
        if (err) throw err;
    });
}

/**
 * Remove element from a list in redis
 * @param {string} key key value of the list in redis
 * @param {string} elem element to remove
 */
var removeElementFrom = function (key, elem) {
    client.lrem([key, 0, JSON.stringify(elem)], function (err, res) {
        if (err) throw err;
    });
}


/*============================================================
    OTHER UTILS
==============================================================*/

/**
 * Parse a command result to its string equivalent
 * @param {String} cmdFormat 
 * @param {JSON} cmdResult
 * @param {Function} fn 
 */
var cmdToString = function (label, body, fn) {
    switch (label) {

        case 'bestsender':
            fn( body.user.username + ' with ' + body.count + ' messages' );
            break;

        case 'nbusers':
            fn( body.count + ' users in this room' );
            break;

        case 'currentusers':
            let tmp = "Logged users :";
            body.forEach(user => {
                tmp = tmp.concat(' ', user.username);
            });
            fn(tmp);
            break;
    
        default:
            break;
    }

    // let reg = new RegExp("^![a-z]+[0-9]*[a-z]*");
    // let temp = cmdText.split(' ');

    // // match regex
    // for (let str in temp) {
    //     if (temp[str].match(reg)) {
    //         let field = temp[str].replace('!', '');
    //         temp[str] = body[field];
    //     }
    // }

    // fn(temp.join(' '));
}


// EXPORTS
module.exports = {
    Rclient : client,
    getList : getList,
    addElementTo : addElementTo,
    removeElementFrom : removeElementFrom,
    cmdToString : cmdToString
};