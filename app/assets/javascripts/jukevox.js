/**
 * jukevox.js
 * @author Frédéric Bolduc
 *****************/
 
var apiswf = null;

$(document).ready(function() {
	var flashvars = {
		'playbackToken': playback_token, // from token.js
		'domain': domain,                // from token.js
		'listener': 'rdio_cb'    // the global name of the object that will receive callbacks from the SWF
	};
	var params = {
		'allowScriptAccess': 'always'
	};
  	var attributes = {};
  	
  	swfobject.embedSWF('http://www.rdio.com/api/swf/',
      				   'apiswf',
      				   1, 1, '9.0.0', 'expressInstall.swf', flashvars, params, attributes);

	// Contrôles temporaires
	$('#play').click(function() {
    	apiswf.rdio_play('a997982');
  	});
  	$('#stop').click(function() { apiswf.rdio_stop(); });
  	$('#pause').click(function() { apiswf.rdio_pause(); });
  	$('#previous').click(function() { apiswf.rdio_previous(); });
  	$('#next').click(function() { apiswf.rdio_next(); });
  	
  	// Configuration de l'autocomplete
  	$('#txt_suggestion').autocomplete({
  		source: function(request, response) {
                $.ajax({
                    url: "/suggestions",
                    dataType: "json",
                    data: {
                        query: $('#txt_suggestion').val()
                    },
                    success: function( data ) {
                        response( $.map( data, function( item ) {
                            return {
                                value: item.artist + ' - ' + item.name,
                                key: item.key
                            }
                        }));
                    }
                });
            },
            minLength: 2,
            select: function(event, ui) {
                $('#hid_key_morceau').val(ui.item.key);
            },
            open: function() {
                $(this).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
            },
            close: function() {
                $(this).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
            }
  	});
});

// Objet de callback
var rdio_cb = {};

// INITIALISATION
rdio_cb.ready = function ready(user) {
  	apiswf = $('#apiswf').get(0);
	apiswf.rdio_setVolume(1);

  	console.log(user);
}

rdio_cb.freeRemainingChanged = function freeRemainingChanged(remaining) {
  $('#remaining').text(remaining);
}

rdio_cb.playStateChanged = function playStateChanged(playState) {
  // The playback state has changed.
  // The state can be: 0 - paused, 1 - playing, 2 - stopped, 3 - buffering or 4 - paused.
  $('#playState').text(playState);
}

rdio_cb.playingTrackChanged = function playingTrackChanged(playingTrack, sourcePosition) {
  // The currently playing track has changed.
  // Track metadata is provided as playingTrack and the position within the playing source as sourcePosition.
  if (playingTrack != null) {
    $('#titre_morceau').text(playingTrack['name']);
    $('#album_morceau').text(playingTrack['album']);
    $('#artiste_morceau').text(playingTrack['artist']);
    $('#thumb_album').attr('src', playingTrack['icon']);
  }
}

rdio_cb.playingSourceChanged = function playingSourceChanged(playingSource) {
  // The currently playing source changed.
  // The source metadata, including a track listing is inside playingSource.
}

rdio_cb.volumeChanged = function volumeChanged(volume) {
  // The volume changed to volume, a number between 0 and 1.
}

rdio_cb.muteChanged = function muteChanged(mute) {
  // Mute was changed. mute will either be true (for muting enabled) or false (for muting disabled).
}

rdio_cb.positionChanged = function positionChanged(position) {
  //The position within the track changed to position seconds.
  // This happens both in response to a seek and during playback.
  $('#position').text(position);
}

rdio_cb.queueChanged = function queueChanged(newQueue) {
  // The queue has changed to newQueue.
}

rdio_cb.shuffleChanged = function shuffleChanged(shuffle) {
  // The shuffle mode has changed.
  // shuffle is a boolean, true for shuffle, false for normal playback order.
}

rdio_cb.repeatChanged = function repeatChanged(repeatMode) {
  // The repeat mode change.
  // repeatMode will be one of: 0: no-repeat, 1: track-repeat or 2: whole-source-repeat.
}

rdio_cb.playingSomewhereElse = function playingSomewhereElse() {
  // An Rdio user can only play from one location at a time.
  // If playback begins somewhere else then playback will stop and this callback will be called.
}

rdio_cb.updateFrequencyData = function updateFrequencyData(arrayAsString) {
  // Called with frequency information after apiswf.rdio_startFrequencyAnalyzer(options) is called.
  // arrayAsString is a list of comma separated floats.

  var arr = arrayAsString.split(',');

  $('#freq div').each(function(i) {
    $(this).width(parseInt(parseFloat(arr[i])*500));
  })
}