const socket = io();


/**
 * Scroll to bottom if user didn't scrolled up to read old messages
 */
function scrollToBottom() {
    if ($(window).scrollTop() + $(window).height() + 2 * $('#messages li').last().outerHeight() >= $(document).height()) {
      $("html, body").animate({ scrollTop: $(document).height() }, 0);
    }
  }


/* ===========================================
    EVENTS
=========================================== */

/**
 * Event reception : user logged in
 * add a user to connected user list
 */
socket.on('user-login', function(user) {
    if(user !== undefined) {
        console.log(user);
        $('#users').append($('<li class="' + user.username + ' new">').html(user.username + '<span class="typing">typing...</span>'));
        setTimeout(function () {
            $('#users li.new').removeClass('new');
        }, 1000);
    }
});


/**
 * Event reception : user logged out
 * remove a user from connected user list
 */
socket.on('disconnect', function() {
    if(loggedUser !== undefined) {
        var selector = '#users li.' + user.username;
        $(selector).remove();
    }
});


/**
 * Event reception : message
 */
socket.on('redirected-message', function(message) {
    $('#messages').append($('<li>').html('<span class="username">' + message.sender + '</span>' + message.text));
    scrollToBottom();
});


/**
 * Event reception : service message
 */
socket.on('service-message', function(message) {
    $('#messages').append($('<li class="' + message.type + '">').html('<span class="info">information</span> ' + message.text));
    scrollToBottom();
});


/**
 * Event reception : 'update-typing'
 * Manage other users typing
 */
socket.on('update-typing', function (typingUsers) {
    $('#users li span.typing').hide();
    for (i = 0; i < typingUsers.length; i++) {
        $('#users li.' + typingUsers[i].username + ' span.typing').show();
  }
});


/**
 * Event emission : user connection
 */
$('#login form').submit(function(e) {
    e.preventDefault();
    // JSON user
    let user = {
        username : $('#login input').val().trim()
    };
    // user input field not empty
    if (user.username.length > 0) {
        socket.emit('user-login', user, function(success) {
            if(success) {
                $('body').removeAttr('id');    // hiding login form
                $('#chat input').focus();      // focus on message field
            }
        });
    }
});


/**
 * Event emission : submit message
 */
$('#chat form').submit(function(e) {
    e.preventDefault();                 // avoid page reloading during form validation
    // JSON message
    let message = {
        text : $('#m').val(),
        sent_at : new Date()
    };
    $('#m').val('');                            // dump text field
    if (message.text.trim().length !== 0) { 
        socket.emit('chat-message', message);   // emit event with associated message
    }
    $('#chat input').focus();   // focus on message field
});


/**
 * Event emission : detect user typing
 */
let typingTimer;
let isTyping = false;

// User started typing
$('#m').keypress(function () {
    clearTimeout(typingTimer);
    if (!isTyping) {
      socket.emit('start-typing');
      isTyping = true;
    }
  });
  
// User stopped typing
$('#m').keyup(function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function () {
        if (isTyping) {
        socket.emit('stop-typing');
        isTyping = false;
        }
    }, 1000);
});