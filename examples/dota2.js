var Gosu = require('../index');

// Pull page 3 of Dota2 matches.
Gosu.fetchMatchUrls('dota2', 3, function (err, urls){
	if (err) { console.log(err); }
	else {
		// Parse them all and return an array of objects
		Gosu.parseMatches(urls, function(err, results){
			console.log(results);
		});
	}
});

/*
Snippet of results showing three different match statuses:

[{
	url: 'http://www.gosugamers.net/lol/tournaments/6976-lol-battle-arena/1869-group-stage/6977-group-stage/matches/83951-tornado-rox-vs-meet-your-makers-tr',
    home:
     { name: 'Tornado Rox',
       url: '/lol/teams/12649-tornado-rox',
       country: 'Russian Federation',
       rank: 57 },
    away:
     { name: 'Meet Your Makers.TR',
       url: '/lol/teams/12685-meet-your-makers-tr',
       country: 'Turkey',
       rank: 47 },
    status: 'Live',
    type: 'lol',
    rounds: 'Best of 3',
    valueBet: true
},

{
	url: 'http://www.gosugamers.net/dota2/tournaments/7067-the-international-2015/1902-group-stage/7070-group-b/matches/84811-newbee-vs-team-empire-dota2',
    home:
     { name: 'NewBee',
       url: '/dota2/teams/7763-newbee',
       country: 'China',
       rank: 13,
       score: 1 },
    away:
     { name: 'Team Empire Dota2',
       url: '/dota2/teams/2280-team-empire-dota2',
       country: 'Russian Federation',
       rank: 10,
       score: 1 },
    status: 'Complete',
    type: 'dota2',
    rounds: 'Best of 2',
    valueBet: true,
    datetime: 1438205400
},

{
  	url: 'http://www.gosugamers.net/dota2/tournaments/7331-hitbox-eu-championship-3/matches/86826-team-alternate-dota-2-vs-myinsanity',
    home:
     { name: 'Team Alternate Dota 2',
       url: '/dota2/teams/12074-team-alternate-dota-2',
       country: 'Poland',
       rank: 62 },
    away:
     { name: 'mYinsanity',
       url: '/dota2/teams/2820-myinsanity',
       country: 'Serbia',
       rank: 84 },
    status: 'Upcoming',
    type: 'dota2',
    rounds: 'Best of 3',
    valueBet: true,
    datetime: 1440522000
}]
*/