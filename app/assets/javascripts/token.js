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
	window.playback_token = "GAxQuns9_____3o3eXd2cng5MnNqOW1lenByam55ejNhaGpwYm91Z2llLmNvbTRd2xNVKsBMP9CrzISZp00=";

