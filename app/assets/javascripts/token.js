/**
 * token.js
 * @author Frédéric Bolduc
 *********************/

var domain = location.hostname;

// Token de développement localhost
if (domain == 'localhost')
	var playback_token = "GAlNi78J_____zlyYWs5ZG02N2pkaHlhcWsyOWJtYjkyN2xvY2FsaG9zdEbwl7EHvbylWSWFWYMZwfc=";
// Token authentifié
else
	var playback_token = "GABQukMn_____3o3eXd2cng5MnNqOW1lenByam55ejNhaKQ1mwSFmKnsoqikOywyDyE=";

