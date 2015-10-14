var Gosu = require("./gosuapi.js");

Gosu.parseMatch("http://www.gosugamers.net/counterstrike/tournaments/7473-cs-go-champions-league-season-2/2017-group-stage/7477-group-d/matches/88873-hellraisers-vs-penta-sports" , function(err,match){
	console.log(match);
});


//http://www.gosugamers.net/counterstrike/tournaments/7551-faceit-league-2015-stage-iii/2050-round-robin/7552-european-division/matches/88693-hellraisers-vs-ninjas-in-pyjamas
//Gosu.fetchMatchUrls('csgo', function(err, urls) {
// console.log(urls);
//});
