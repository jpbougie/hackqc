function debug(msg) {
  $('#log').append('<div>' + msg + '</div>');
};

setupJukevox = function() {
    window.socket = io.connect('http://localhost:9191');
    socket.on('authChallenge', function (data) {
      debug("Challenged for auth by server");
      socket.emit("authResponse", user);
    });

    socket.on('waiting', function(data) {
      debug("Waiting for an opponent...")
    });

    socket.on('matchFound', function(data) { 
      debug("Opponent found: " + data.other)
    });

    socket.on("matchEnded", function() {
      debug("Match ended");
    });
};