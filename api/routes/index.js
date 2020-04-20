const router = require('express').Router();
const controller = require('../controllers');

// url
const base_url = '/api';
const message_url = base_url + '/message'
const user_url = base_url + '/user'


/*============================================================
    MESSAGE ROUTING
==============================================================*/

/**
 * Post a message
 */
router.post(message_url, (req, res) => {
    controller.postMessage(req, res);
});

/**
 * Get all messages
 */
router.get(message_url, (req, res) => {
    controller.getAllMessages(req, res);
});

/**
 * Get all messages from a user
 */
router.get(message_url + '/:username', (req, res) => {
    controller.getUserMessages(req, res);
});

/**
 * Get all messages up to n-minutes old
 */
router.get(message_url + '/history', (req, res) => {
    // controller
});


/*============================================================
    USER ROUTING
==============================================================*/

/**
 * Create a new user
 */
router.post(user_url, (req, res) => {
    controller.createUser(req, res);
});

/**
 * Get a user
 */
router.get(user_url, (req, res) => {
    // controller
});

/**
 * Get the user who sent the most messages
 */
router.get(user_url + '/bestsender', (req, res) => {
    // controller
});

/**
 * Get the user who received the most messages
 */
router.get(user_url + '/bestreceiver', (req, res) => {
    // controller
});



// Exports
module.exports = router;