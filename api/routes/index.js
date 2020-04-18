const router = require('express').Router();
const controller = require('../controllers');
const base_url = '/api/message';


/**
 * Get all messages
 */
router.get(base_url, (req, res) => {
    controller.getAllMessages(req, res);
});

/**
 * Get all messages from a user
 */
router.get(base_url + '/:username', (req, res) => {
    controller.getUserMessages(req, res);
});

/**
 * Get all messages up to n-minutes old
 */
router.get(base_url + '/history', (req, res) => {
    // controller
});

/**
 * Get the user who sent the most messages
 */
router.get(base_url + '/bestsender', (req, res) => {
    // controller
});

/**
 * Get the user who received the most messages
 */
router.get(base_url + '/bestreceiver', (req, res) => {
    // controller
});

/**
 * Post a message
 */
router.post(base_url, (req, res) => {
    controller.postMessage(req, res);
});


// Exports
module.exports = router;