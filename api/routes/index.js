const router = require('express').Router();
const controller = require('../controllers');

// url
const base_url = '/api';
const message_url = base_url + '/message'
const user_url = base_url + '/user'


/*============================================================
    SPECIFIC ROUTING
==============================================================*/

/**
 * Get the user who sent the most messages
 */
router.get(base_url + '/bestsender', (req, res) => {
    controller.getBestSender(req, res);
});

/**
 * Get the user who has been tagged the most
 */
router.get(base_url + '/mostTagged', (req, res) => {
    // controller
});


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
router.get(user_url + '/:username', (req, res) => {
    controller.getUser(req, res);
});



// Exports
module.exports = router;