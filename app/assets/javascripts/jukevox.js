/**
 * jukevox.js
 * @author Frédéric Bolduc
 *****************/
 
var apiswf = null;

$(document).ready(function() {
	var flashvars = {
	  'enableLogging': 1,
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
  	
  	$('#feedback_top').hide();
  	
  	initAutocomplete();
  	initPisCa();
  	initVotes();
});

/**
 * Initialise le champ autocomplete pour choisir une chanson
 */
function initAutocomplete() {
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
}

/** 
 * Initialise le bouton "Pis ça?" qui permet de proposer une chanson
 */
function initPisCa() {
  	$('#btn_pis_ca').click(function(e) {
  		e.preventDefault();
  		var key = $('#hid_key_morceau').val();
  		window.socket.emit('nextSong', key);
  		
  		$('#feedback_top').slideUp('fast', function() {
  			$(this).empty();
  		});
  		
  		window.socket.emit("readyForNext");
  		$('#frm_suggerer').slideUp('fast', function() {
  		  var labelMorceau = $('#txt_suggestion').val();
  		  $('#coming_up_next > span').html(labelMorceau);
  		  $('#coming_up_next').fadeIn('fast');
  		});
  		
  		//apiswf.rdio_play($('#hid_key_morceau').val());
  	});
}

/**
 * Initialise les boutons de vote
 */
function initVotes() {
	$('.jtrippe').click(function(e) {
		e.preventDefault();
		traiterEnvoiJukes('2');
	});
	
	$('.paspire').click(function(e) {
		e.preventDefault();
		traiterEnvoiJukes('1');
	});
	
	$('.bofouin').click(function(e) {
		e.preventDefault();
		traiterEnvoiJukes('-1');
	});	
}

/**
 * Envoie le message au serveur, qui lui retourne les jukes actuels de l'adversaire
 * @param La différence à appliquer sur les jukes de l'adversaire
 */
function traiterEnvoiJukes(differentiel) {
	var toiId = $('#toi_id').html();
		
	$.post('users/' + toiId + '/' + differentiel, null, function(data) {
		$('#toi_jukes').html(data);
	});
}

/*********
 * CONFIGURATION RDIO WEB PLAYBACK API
 ***********/
// Objet de callback
var rdio_cb = {};

// INITIALISATION
rdio_cb.ready = function ready(user) {
  	apiswf = $('#apiswf').get(0);

  	console.log(user);
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
