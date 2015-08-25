var Gosu = require('../index');
var expect = require('chai').expect;

// Parameters for URL fetching tests
var params = [
	{type: null, page: null, name: 'Defaults'},
	{type: null, page: 2, name: 'Defaults, Page 2'},
	{type: 'csgo', page: null, name: 'Counter-Strike: Global Offensive'},
	{type: 'dota2', page: null, name: 'DOTA 2'},
	{type: 'hearthstone', page: null, name: 'Hearthstone'},
	{type: 'hots', page: null, name: 'Heroes of the Storm'},
	{type: 'lol', page: null, name: 'League of Legends'}
];

describe('Fetch URLs', function(){
	params.forEach(function (test) {
		describe(test.name, function(){
			var urls;
			before(function (done){
				Gosu.fetchMatchUrls(test.type, test.page, function (err, u){
					if (err) done(new Error(err));
					else {
						urls = u;
						done();
					}
				});
			});
			it('should return an array', function(){
				expect(urls).to.have.length.above(5);
			});
			it('should contain only valid URLs', function(){
				urls.forEach(function (url){
					expect(url).to.match(/^http:\/\/www.gosugamers.net\//);
				});
			});
		});
	});
});

// Multiple matches is a wrapper of a single match, so we don't
// have to to test parseMatch() directly.
describe('Parse Matches', function() {
	var url = [];
	var match;

	before(function (done) {
		Gosu.fetchMatchUrls(function (err, urls){ // This doesn't appear to be running?
			if (err) {
				done(new Error(err));
			} else {
				Gosu.parseMatches(url, function (err, matches) {
					if (err) {
						done(new Error(err));
					}
					else {
						match = matches;
						return done();
					}
				});
			}
		});
	});


	it('should be an array', function(){
		expect(match).to.be.an('array');
	});

	it('should contain valid match objects', function() {
		match.forEach(function (m, i, a){
			expect(m).to.contain.all.keys(['url', 'home', 'away', 'status', 'type', 'rounds', 'valueBet']);
			expect(m.home).to.have.ownProperty('url');
			expect(m.home).to.have.ownProperty('country');
			expect(m.home).to.have.ownProperty('rank');
			expect(m.home).to.have.ownProperty('name');
			expect(m.away).to.have.ownProperty('url');
			expect(m.away).to.have.ownProperty('country');
			expect(m.away).to.have.ownProperty('rank');
			expect(m.away).to.have.ownProperty('name');
		});
	});

	it('should contain scores for completed matches', function() {
		match.forEach(function (m, i, a) {
			if (m.status == 'Complete') {
				expect(m.home.score).to.be.within(0,50);
				expect(m.away.score).to.be.within(0,50);
			}
		});
	});

});