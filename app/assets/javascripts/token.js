/**
 * token.js
 * @author Frédéric Bolduc
 *********************/

var domain = location.hostname;

// Token de développement localhost
if (domain == 'localhost')
  window.playback_token = "GAlNi78J_____zlyYWs5ZG02N2pkaHlhcWsyOWJtYjkyN2xvY2FsaG9zdEbwl7EHvbylWSWFWYMZwfc=";
// Token authentifié
else
	window.playback_token = "GAxQunzU_____2R2cHlzNHd5ZXg3Z2M0OXdoaDY3aHdrbmpwYm91Z2llLmNvbRrwa0FXk57zdUyfzW9ovRQ";

