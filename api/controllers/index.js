const Models = require('../models');


/**
 * Check if a user exists in database. If so, pass it to callback function.
 * @param {String} name 
 * @param {Function} fn 
 */
function exists(name, fn) {
    Models.User.findOne( {username: name} )
    .exec(function (err, user) {
        if (user != null) {
            fn(err, user);
        } else {
            fn('user not found', null);
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
    exists(req.body.sender, function (err, user) {
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
    exists(req.params.username, function (err, user) {
        // user not found
        if (err) return res.status(404).json( {error: err} );
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
    exists(req.body.username, function (err, user) {
        if (user != null) return res.json( {message: "user already exists"} );
        // create new user
        const new_user = Models.User({      
            username: req.body.username
        });
        // save it
        new_user.save( function (err2, saved_user) {    
            if (err2) throw err2;
            console.log(saved_user);
            res.status(201).json({
                message: 'success',
                inserted_id: saved_user._id
            });
        });
    });
}


/**
 * Get a user
 * @param {*} req 
 * @param {*} res 
 */
function getUser(req, res) {

    // check if user exists
    exists(req.params.username, function (err, user) {
        if (err) return res.status(404).json( {error: err} );   // user not found
        res.json(user);
    })
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
        res.json(users[0]);
    });
}


// EXPORTS
module.exports = {
    getAllMessages : getAllMessages,
    getUserMessages : getUserMessages,
    postMessage : postMessage,
    createUser : createUser,
    getUser : getUser,
    getBestSender : getBestSender
};