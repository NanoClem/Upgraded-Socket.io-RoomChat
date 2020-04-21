// Init libs and app
const express = require('express');
const app = express();
const http = require('http').Server(app);
const request = require('request');
const io = require('socket.io')(http);
const utils = require('../utils');
const HOST = 'http://localhost';
const PORT = 3000;
const URL = HOST + ":" + PORT;


// User http requests are redirected to 'public' folder
app.use("/", express.static(__dirname + "/../public"));

// Express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// API
const APIRoutes = require('../api/routes');
app.use(APIRoutes);

// Redis
const Rclient = utils.Rclient;

// Body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded ( {
	extended : true
}));
app.use(bodyParser.json());


/**
 * Connection to mongoDB
 */
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);      // using new parser
mongoose.set('useUnifiedTopology', true);
database = 'mongodb://localhost:27017/chatDB';
mongoose.connect(database, (err)=> {
	if (err)
		throw err;
	console.log('connected to database');
});


/**
 * Listening redis error
 */
Rclient.on('error', function (error) {
    console.error(error);
})

/**
 * Listening connection on redis server
 */
Rclient.on('connect', function (err, res) {
    console.log('connected to redis server');
})


/**
 * Connected user list params (Redis)
 */
var k_users = "usr_connected";
var users = [];
Rclient.del(k_users);   // remove existing key to avoid conflicts

/**
 * User currently typing in chat input
 */
var typingUsers = [];

/**
 * Messages history (MongoDB)
 */
var messages = [];
const MSG_LIMIT = 150;

/**
 * Service messages history (MongoDB)
 */
var srvc_messages = [];
//const SRVC_LIMIT = 150;


/* ===========================================
    EVENTS
=========================================== */

io.on('connection', function(socket) {

    /**
     * Connection logging
     */
    console.log('user connected to server');

    /**
     * Last connected user
     */
    var loggedUser;
   
    
    /**
     * Event emission : send connected user list to all connected users
     */
    for(i = 0; i < users.length; i++) {
        socket.emit('user-login', JSON.parse(users[i]));
    }


    /**
     * Event emission : send each message from history (MongoDB)
     */
    for (i = 0; i < messages.length; i++) {
        if (messages[i].username !== undefined) {
            socket.emit('redirected-message', JSON.parse(messages[i]));
        }
        else {
            socket.emit('service-message', messages[i])
        }
    }


    /**
     * Event reception : user disconnected, broadcast 'service-message'
     */
    socket.on('disconnect', function() {

        if(loggedUser !== undefined) {
            // JSON service message
            let serviceMessage = {
                text : loggedUser.username + ' logged out',
                type : 'logout'
            };
            socket.broadcast.emit('service-message', serviceMessage);
            // Remove it from conneted list and refresh it
            utils.removeElementFrom(k_users, loggedUser);
            utils.getList(k_users, function (list) {   
                users = list;
            });
            // remove it from database
            request.delete(URL + "/api/user", {json: true, body: loggedUser}, function (err, res, body) {
                if (err) console.log(err);  // log err
                if (res.statusCode != 204) console.log(body);
            });
            io.emit('user-logout', loggedUser);
            // Add to history
            srvc_messages.push(serviceMessage);
            // If user was typing
            let typingUserIndex = typingUsers.indexOf(loggedUser);
            if (typingUserIndex !== -1) {
                typingUsers.splice(typingUserIndex, 1);
              }
        }
        console.log('user disconnected from server');
    });

    
    /**
     * Event reception : user connected with login form
     *   - saving user
     *   - broadcast 'service-message'
     */
    socket.on('user-login', function(user, callback) {

        // Check if user doesn't exist (make a login/passwd connection)
        let userIndex = -1;
        for(i = 0; i < users.length; i++) {
            if (JSON.parse(users[i]).username === user.username) {
                userIndex = i;
            }
        }
        // Do things
        if(user !== undefined && userIndex === -1) {
            loggedUser = user;  // save new connected user
            // store him into database
            request.post(URL + "/api/user", {json: true, body: user}, function (err, res, body) {
                if (err) console.log(err);
                if (res.statusCode != 201) console.log(body);
                console.log('new registered user :' + body);
            });
            // add it to connected list and refresh it
            utils.addElementTo(k_users, loggedUser);
            utils.getList(k_users, function (list) {   
                users = list;
            });
            // JSON user service message
            usr_serviceMessage = {
                text : 'Logged in as ' + loggedUser.username,
                type : 'login'
            };
            // JSON broadcasted service message
            let brdc_serviceMessage = {
                text : loggedUser.username + ' logged in',
                type : 'login'
            };
            // EMIT service messages
            socket.emit('service-message', usr_serviceMessage);
            socket.broadcast.emit('service-message', brdc_serviceMessage);
            
            srvc_messages.push(brdc_serviceMessage);    // Push service message to history
            io.emit('user-login', loggedUser);          // Emit 'user-login' and callback
            callback(true);
        } 
        else {
            callback(false);
        }
    });


    /**
     * Event reception : 'chat-message', re-emission to all users
     * Add message to history and purge if necessary
     */
    socket.on('chat-message', function(message) {

        message.sender = loggedUser.username;     // adding sender to message object
        message.type = "chat-message";            // defining message type
        io.emit('redirected-message', message);   // re-emit message to all user
        messages.push(message);                   // push message to history
        // store message in database
        request.post(URL + "/api/message", {json: true, body: message}, function (err, res, body) {
            if (err) console.log(err);  // log err
            if (res.statusCode != 201) console.log(body);
        });
        // check if history container is full
        if (messages.length > MSG_LIMIT) {
            messages.splice(0, 1);
        }
        console.log('Message from : ' + loggedUser.username);
    });


    /**
     * Event reception : 'chat-cmd', re-emission to the user who requested it
     * Execute requested chat cmd, send back the result
     */
    socket.on('chat-cmd', function(message) {

        message.sender = loggedUser.username;     // adding sender to message object
        message.type = "chat-cmd";                // defining message type
        // store message in database
        request.post(URL + "/api/message", {json: true, body: message}, function (err, res, body) {
            if (err) console.log(err);  // log err
            if (res.statusCode != 201) console.log(body);
        });
        message.text = message.text.replace('!', '');  // format cmd
        // chatbot response to cmd
        let cmd_response = {
            sender: "chatbot",
            type: 'chatbot-response'
        };
        // make cmd request
        request.get(URL + "/api/cmd/" + message.text, {json: true}, function (err, res, body) {
            if (res.statusCode != 200) {
                cmd_response.text = "Uknown command";
                socket.emit('redirected-message', cmd_response);    // redirect message only to sender
            } else {
                utils.cmdToString(message.text, body, function (cmdStr) {
                    cmd_response.text = cmdStr;
                    socket.emit('redirected-message', cmd_response);    
                });
            }
        });
        console.log('CMD from : ' + loggedUser.username);
    });


    /**
     * Event reception : 'start-typing'
     * User start to type his message
     */
    socket.on('start-typing', function () {

        if (typingUsers.indexOf(loggedUser) === -1) {
            typingUsers.push(loggedUser);
        }
        io.emit('update-typing', typingUsers);
    });


    /**
     * Event reception : 'stop-typing'
     * User stopped typing his message
     */
    socket.on('stop-typing', function () {
        let typingUserIndex = typingUsers.indexOf(loggedUser);
        if (typingUserIndex !== -1) {
            typingUsers.splice(typingUserIndex, 1);
          }
          io.emit('update-typing', typingUsers);
    });
});


// Launch server
http.listen(PORT, function() {
    console.log("Server listening on port " + PORT);
});
