function debug(msg) {
  $('#log').append('<div>' + msg + '</div>');
}

setupJukevox = function(host) {
  return function() {
    var didWait = false;
    window.socket = io.connect(host);
    
    /**** AUTHENTIFICATION ****/
    socket.on('authChallenge', function (data) {
      debug("Challenged for auth by server");
      socket.emit("authResponse", user);
    });

    /**** EN ATTENTE D'UN JOUEUR ****/
    socket.on('waiting', function(data) {
      didWait = true;
      $('#feedback_top').html('It\'s your turn to pick!');
  	  $('#feedback_top').slideDown('fast');
  	  $('#coming_up_next').fadeOut('fast', function() {
  	    $('#frm_suggerer').slideDown('fast');
  	  });
  	  
  	  $('#waiting_for_opponent').fadeIn('fast');
  	  
      debug("Waiting for an opponent...");
    });

    /**** MATCH TROUVÉ ****/
    socket.on('matchFound', function(data) {
      if (didWait) {
      	didWait = false;
      }
      else {
      	socket.emit('readyForNext');
      }
      	
      debug("Opponent found: " + data.other);
      getUserByToken(data.other, function(data) {
      	$('#toi_id').html(data.token);
        $("#toi_photo").html("<img src=\"//" + data.image_url + "\" />");
        $('#toi_nom').html(data.username);
        $('#toi_jukes').html(data.jukes);
        
        $('#waiting_for_opponent').fadeOut('fast', function() {
          $('#toi').fadeIn('fast');
        });
      });
    });

    /**** MATCH TERMINÉ ****/
    socket.on("matchEnded", function() {
      $('#toi').fadeOut('fast', function() {
      	$('#waiting_for_opponent').fadeIn('fast');
      });
      
      $('#vox').fadeOut('fast');
      
      debug("Match ended");
    });

    /**** TOUNE COMMENCE À JOUER ****/
    socket.on('play', function(data) {
      apiswf.rdio_play(data.song);

      lookupTumbz(data.song);

      // Si c'est le tour de l'autre à jouer
      var toiId = $('#toi_id').html();
      if (data.turn == toiId) {
        $('#frm_suggerer').fadeOut('fast');
        $('#coming_up_next').fadeOut('fast');
        $('#vox').fadeOut('fast');
      }
      else {
        $('#feedback_top').html('It\'s your turn to pick!');
  	    $('#feedback_top').slideDown('fast');
  	    $('#coming_up_next').fadeOut('fast', function() {
  	      $('#frm_suggerer').slideDown('fast');
  	    });
  	    $('#vox').fadeIn('fast');
      }
      
      $('#vox_choix').empty().show();
      
      setTimeout(fireReadyForNext, 30000);
    });

    /**** JUKES UPDATE ****/
    socket.on("jukesUpdated", function(jukes) {
      $('#moi_jukes').html(jukes);
    })

    /**** CLIC SUR PROCHAIN VOXEUR ****/
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

function lookupTumbz(song) {
  var albumId = $.get('/album/' + song, function(data) {
    $.ajax({
      'url':"http://api.tum.bz/v1/products/search?q=" + data + "&apikey=nzaEhGbo4B9yAOn1GKveoSL003sexY9F",
      'dataType':'jsonp'
    }).success(function(data){
      var prodId = results[0].id;
      $.ajax({
        'url':"http://api.tum.bz/v1/users?limit=25&apikey=nzaEhGbo4B9yAOn1GKveoSL003sexY9F&tumbzed_product_up=" + prodId,
        'dataType':'jsonp'
      }).success(function(data){
        showTumbz(people);
      });
    });
  })
}

function showTumbz(people) {
  for(i = 0; i < people.length; i++) {
    $('div#tumbz_likes').append('<img src="' + people[i].avatar + '" />');
  }
}