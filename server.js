// Init libs and app
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Params
const PORT = 3000;

// User http requests are redirected to 'public' folder
app.use("/", express.static(__dirname + "/public"));


/**
     * Connected user list (Redis)
     */
    var users = [];

    /**
     * Message history (MongoDB)
     */
    var messages = [];
    const MSG_LIMIT = 150;



// EVENTS

io.on('connection', function(socket) {

    /**
     * Last connected user
     */
    var loggedUser;

    
    /**
     * Connection logging
     */
    console.log('user connected to server');


    /**
     * Event emission : send connected user list to all connected users
     */
    for(i = 0; i < users.length; i++) {
        socket.emit('user-login', user[i]);
    }


    /**
     * Event reception : user disconnected, broadcast 'service-message'
     */
    socket.on('disconnect', function() {
        if(loggedUser !== undefined) {

            // JSON service message
            let serviceMessage = {
                text : loggedUser.username + ' disconnected',
                type : 'logout'
            };
            socket.broadcast.emit('service-message', serviceMessage);

            // Remove it from conneted list
            let userIndex = users.indexOf(loggedUser);
            if (userIndex !== -1) {
                users.splice(userIndex, 1);
            }
            io.emit('user-logout', loggedUser);
        }
    });

    
    /**
     * Event reception : user connected with login form
     *   - saving user
     *   - broadcast 'service-message'
     */
    socket.on('user-login', function(user, callback) {

        // Check if user doesn't exist
        let userIndex = -1;
        for(i = 0; i < users.length; i++) {
            if(users[i].username === user.username) {
                userIndex = i;
            }
        }
        // Do things
        if(user !== undefined && userIndex === -1) {
            loggedUser = user;          // SAVE USER (MongoDB)
            users.push(loggedUser);     // push it to connected user list (Redis)
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
            socket.broadcast.emit('service-message', brdc_serviceMessage);
            // Emit 'user-login' and callback
            io.emit('user-login', loggedUser);
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
        message.username = loggedUser.username;     // adding user
        io.emit('redirected-message', message);     // re-emit message to all user
        console.log('Message from : ' + loggedUser.username);
    });
});


// Launch server
http.listen(PORT, function() {
    console.log("Server listening on port " + PORT);
});
