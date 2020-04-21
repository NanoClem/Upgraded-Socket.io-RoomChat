const router = require('express').Router();
const controller = require('../controllers');

// url
const base_url = '/api';
const message_url = base_url + '/message';
const user_url = base_url + '/user';
const cmd_url = base_url + '/cmd';


/*============================================================
    COMMANDS ROUTING
==============================================================*/

/**
 * Get all available commands
 */
router.get(cmd_url, (req, res) => {
    controller.getCommandInfo(req, res);
});

/**
 * Create informations about a command
 */
router.post(cmd_url + '/info', (req, res) => {
    controller.createCommandInfo(req, res);
});

/**
 * Get informations about a specific command
 */
router.get(cmd_url + '/info/:cmd', (req, res) => {
    controller.getCommandInfo(req, res);
});

/**
 * Get the current number of user in room chat
 */
router.get(cmd_url + '/nbusers', (req, res) => {
    controller.getNbUsers(req, res);
});

/**
 * Get current users in room chat
 */
router.get(cmd_url + '/currentusers', (req, res) => {
    controller.getCurrentUsers(req, res);
});

/**
 * Get the user who sent the most messages
 */
router.get(cmd_url + '/bestsender', (req, res) => {
    controller.getBestSender(req, res);
});

/**
 * Get the user who has been tagged the most
 */
router.get(cmd_url + '/mostTagged', (req, res) => {
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
 * Delete a user
 */
router.delete(user_url, (req, res) => {
    controller.deleteUser(req, res);
});

/**
 * Get a user
 */
router.get(user_url + '/:username', (req, res) => {
    controller.getUser(req, res);
});



// Exports
module.exports = router;