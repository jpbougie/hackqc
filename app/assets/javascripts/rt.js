function debug(msg) {
  $('#log').append('<div>' + msg + '</div>');
}

setupJukevox = function(host) {
  return function() {
    window.socket = io.connect(host);
    socket.on('authChallenge', function (data) {
      debug("Challenged for auth by server");
      socket.emit("authResponse", user);
    });

    socket.on('waiting', function(data) {
      debug("Waiting for an opponent...");
    });

    socket.on('matchFound', function(data) { 
      debug("Opponent found: " + data.other);
      getUserByToken(data.other, function(data) {
      	$('#toi_id').html(data.token);
        $("#toi_photo").html("<img src=\"//" + data.image_url + "\" />");
        $('#toi_nom').html(data.username);
        $('#toi_jukes').html(data.jukes);
      });
    });

    socket.on("matchEnded", function() {
      debug("Match ended");
    });

    socket.on('play', function(data) {
      apiswf.rdio_play(data.song);
      $('#feedback_formulaire').fadeOut('fast', function() {
        $(this).empty();
      });
      setTimeout(fireReadyForNext, 30000);
    });

    $('#prochain_voxeur').click(function() {
      socket.emit("skip");
    });
  };
};

/**
 * Fonction appelée par une minuterie lorsque 30 secondes sont écoulées. Envoie le 
 * message au serveur que le client est prêt pour une nouvelle chanson.
 */
function fireReadyForNext() {
  socket.emit('readyForNext');
}
