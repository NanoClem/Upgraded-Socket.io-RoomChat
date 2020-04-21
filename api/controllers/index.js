const Models = require('../models');
const redis = require('../../utils');


/**
 * Check if a document exists in database. If so, pass it to callback function.
 * @param {*} model 
 * @param {JSON} filter 
 * @param {Function} fn 
 */
function exists(model, filter, fn) {
    model.findOne(filter)
    .exec(function (err, doc) {
        if (err) throw err;
        if (doc != null) {
            fn(err, doc);
        } else {
            fn('doc not found', null);
        }
    });
}


/*============================================================
    MESSAGE CONTROLLERS
==============================================================*/

/**
 * Get all stored messages
 * @param {*} req 
 * @param {*} res 
 */
function getAllMessages(req, res) {

    Models.Message.find({})
    .populate('sender')
    .exec( function (err, messages) {
        if (err) return res.json(err);
        res.json(messages);
    });
}


/**
 * Post a new message
 * @param {*} req 
 * @param {*} res 
 */
function postMessage(req, res) {
    
    // find sender
    exists(Models.User, {username: req.body.sender}, function (err, user) {
        // user not found
        if (err) return res.status(404).json( {error: err} );
        // create new message
        const new_message = Models.Message({
            text : req.body.text,
            sender : user._id       // save ref
        });
        // save it
        new_message.save( function (err2, message) {
            if (err2) throw err2; 
            res.status(201).json({
                message: 'success',
                inserted_id: message._id
            });
        });
    });
}


/**
 * Get all messages sent by a user
 * @param {*} req 
 * @param {*} res 
 */
function getUserMessages(req, res) {

    // find user
    exists(Models.User, {username: req.body.username}, function (err, user) {
        // user not found
        if (err) return res.status(404).json( {error: 'user not found'} );
        // find all of his messages
        Models.Message.find( {sender: user._id} )
        .populate('sender')
        .exec( function (err2, messages) {
            if (err2) throw err2;
            res.json(messages);
        });
    });
}


/*============================================================
    USER CONTROLLERS
==============================================================*/

/**
 * Create a new user
 * @param {*} req 
 * @param {*} res 
 */
function createUser(req, res) {

    // check if user already exists
    exists(Models.User, {username: req.body.username}, function (err, user) {
        if (user != null) return res.json( {message: "user already exists"} );
        // create new user
        const new_user = Models.User({      
            username: req.body.username
        });
        // save it
        new_user.save( function (err2, saved_user) {    
            if (err2) throw err2;
            res.status(201).json({
                message: 'success',
                inserted_id: saved_user._id
            });
        });
    });
}


/**
 * Delete a user
 * @param {*} req 
 * @param {*} res 
 */
function deleteUser(req, res) {

    // check if user exists
    exists(Models.User, {username: req.body.username}, function (err, user) {
        if (err) return res.status(404).json( {error: 'user not found'} );
        // remove him
        Models.User.deleteOne(user, function (err2) {
            if (err2) throw err2;
            res.status(204);
        });
    })
}


/**
 * Get a user
 * @param {*} req 
 * @param {*} res 
 */
function getUser(req, res) {

    // check if user exists
    exists(Models.User, {username: req.params.username}, function (err, user) {
        if (err) return res.status(404).json( {error: 'user not found'} );
        res.json(user);
    })
}


/*============================================================
    COMMANDS CONTROLLERS
==============================================================*/

/**
 * Return informations about a command
 * @param {*} req 
 * @param {*} res 
 */
function getCommandInfo(req, res) {
    exists(Models.Command, {label: req.params.cmd}, function (err, cmd) {
       if (err) return res.status(404).json( {error: 'comand not found'} );
       res.json(cmd);
    });
}

/**
 * Create informations about a command
 * @param {*} req 
 * @param {*} res 
 */
function createCommandInfo(req, res) {
    Models.Command.findOneAndUpdate({label: req.body.label}, req.body, {upsert: true}, function (err, cmd) {
        if (err) throw err;
        res.status(201).json({
            message: 'success',
            inserted_id: cmd._id
        });
    });
}

/**
 * Return the user who sent the most messages
 * @param {*} req 
 * @param {*} res 
 */
function getBestSender(req, res) {
    Models.Message.aggregate([
        {"$group": {_id: "$sender", count: {"$sum": 1}}},     // group by username and count its occurences
        {"$sort": {count: -1}},                               // sort result by occurence
        {"$lookup": {from: "users", localField: "_id", foreignField: "_id", as: "user"}},    // join collections to populate resulting _id
        {"$limit": 1}                                         // get the max repeated record
    ]).exec( function (err, users) {
        if (err) next(err);
        delete users[0]._id;    // removing useless _id key
        users[0].user = users[0].user[0];
        res.json(users[0]);
    });
}

/**
 * Get informations about current logged users
 * @param {*} req 
 * @param {*} res 
 */
function getCurrentUsers(req, res) {
    redis.getList('usr_connected', function (users) {
        if(users == null) res.status(404).json({error: 'logged users list not found'});
        // JSON parse each user
        for(i = 0; i < users.length; i++) {
            users[i] = JSON.parse(users[i]);
        }
        res.json(users);
    });
}

/**
 * Get the current number of logged users in chat room
 * @param {*} req 
 * @param {*} res 
 */
function getNbUsers(req, res) {
    redis.getList('usr_connected', function (users) {
        if(users == null) res.status(404).json({error: 'logged users list not found'});
        res.json({'count': users.length});
    });
}


// EXPORTS
module.exports = {
    getAllMessages : getAllMessages,
    getUserMessages : getUserMessages,
    postMessage : postMessage,
    createUser : createUser,
    deleteUser : deleteUser,
    getUser : getUser,
    getCommandInfo : getCommandInfo,
    createCommandInfo : createCommandInfo,
    getBestSender : getBestSender,
    getNbUsers : getNbUsers,
    getCurrentUsers : getCurrentUsers
};