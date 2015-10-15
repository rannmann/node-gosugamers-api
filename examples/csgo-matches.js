var Gosu = require("../index.js");
var link = process.argv[2];
Gosu.parseMatch(link , function(err,match){
	console.log(match);
});


//http://www.gosugamers.net/counterstrike/tournaments/7551-faceit-league-2015-stage-iii/2050-round-robin/7552-european-division/matches/88693-hellraisers-vs-ninjas-in-pyjamas
//http://www.gosugamers.net/counterstrike/tournaments/7548-esl-esea-pro-league-season-2/2049-group-stage/7550-north-american-division/matches/88809-complexity-gaming-vs-luminosity-gamin
//Gosu.fetchMatchUrls('csgo', function(err, urls) {
// console.log(urls);
//});
