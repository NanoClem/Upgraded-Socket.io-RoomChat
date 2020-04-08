// Init libs and app
const express = require('express');
const app = express();
const http = require('http').Server(app);

// Params
const PORT = 3000;

// User http requests are redirected to 'public' folder
app.use("/", express.static(__dirname + "/public"));

// Launch server
http.listen(PORT, function() {
    console.log("Server listening on port " + PORT);
});