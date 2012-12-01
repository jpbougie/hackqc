function debug(msg) {
  $('#log').append('<div>' + msg + '</div>');
};

setupJukevox = function(host) {
  return function() {
    window.socket = io.connect(host);
    socket.on('authChallenge', function (data) {
      debug("Challenged for auth by server");
      socket.emit("authResponse", user);
    });

    socket.on('waiting', function(data) {
      debug("Waiting for an opponent...")
    });

    socket.on('matchFound', function(data) { 
      debug("Opponent found: " + data.other)
      getUserByToken(data.other, function() {

      })
    });

    socket.on("matchEnded", function() {
      debug("Match ended");
    });

    $('#prochain_voxeur').click(function() {
      socket.emit("skip");
    });
  };
};