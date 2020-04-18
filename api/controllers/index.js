const Models = require('../models');


/**
 * Get all stored messages
 * @param {*} req 
 * @param {*} res 
 */
function getAllMessages(req, res) {

    Models.Message.find({})
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
    Models.User.findOne( {username: req.body.sender} )
    .exec( function (err, user) {
        if (err) throw err;
        // user not found
        if (user == null) {
            return res.status(404).json( {error: 'user not found'} );
        }
        // create new message
        const new_message = Models.Message({
            text : req.body.text,
            sender : user._id       // save ref
        });
        // save it
        new_message.save( function (err, message) {
            if (err) return handleError(err);
            res.json({
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
    Models.User.findOne( {username: req.body.username} )
    .exec( function (err, user) {
        if (err) return handleError(err);

        // find all of his messages
        Models.Message.find( {sender: user._id} )
        .populate('sender')
        .exec( function (err, messages) {
            if (err) return handleError(err);
            res.json(messages);
        });
    });
}


// EXPORTS
module.exports = {
    getAllMessages : getAllMessages,
    getUserMessages : getUserMessages,
    postMessage : postMessage,
};