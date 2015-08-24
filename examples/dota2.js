var Gosu = require('../index');

// Pull page 5 of Dota2 matches.
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
    url: 'http://www.gosugamers.net/dota2/tournaments/7067-the-international-2015/1901-wild-card-qualifiers/7068-group/matches/84767-mvp-phoenix-vs-vega-squadron',
    home: { name: 'MVP Phoenix', score: 2 },
    away: { name: 'Vega Squadron', score: 1 },
    status: 'Complete',
    type: 'dota2',
    rounds: 'Best of 3',
    valueBet: true,
    datetime: 1437952500
},
{
    url: 'http://www.gosugamers.net/dota2/tournaments/7276-ucc-season-3/1963-group-stage/7277-group-a/matches/86566-scaryfacezzz-dota-2-vs-sqreen-s-squad',
    home: { name: 'SCARYFACEZZZ.Dota 2' },
    away: { name: 'Sqreen\'s Squad' },
    status: 'Upcoming',
    type: 'dota2',
    rounds: 'Best of 3',
    valueBet: true,
    datetime: 1440601200
},
{
    url: 'http://www.gosugamers.net/dota2/tournaments/7331-hitbox-eu-championship-3/matches/86824-hehe-united-vs-sqreen-s-squad',
    home: { name: 'hehe united' },
    away: { name: 'Sqreen\'s Squad' },
    status: 'Live',
    type: 'dota2',
    rounds: 'Best of 3',
    valueBet: true
}]
*/