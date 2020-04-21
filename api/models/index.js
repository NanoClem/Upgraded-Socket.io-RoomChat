const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/**
 * User model
 */
const User = new Schema({
    username : String,
    created_at : {
        type: Date,
        default: Date.now
    }
});

/**
 * Message model
 */
const Message = new Schema({
    text : String,
    type: String,
    sender : {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    sent_at : {
        type: Date,
        default: Date.now
    }
});

/**
 * Commands model
 */
const Command = new Schema({
    label: String,
    text: String,
    created_at : {
        type: Date,
        default: Date.now
    }
});


// EXPORTS
module.exports = {
    User: mongoose.model('User', User),
    Message: mongoose.model('Message', Message),
    Command: mongoose.model('Command', Command)
};