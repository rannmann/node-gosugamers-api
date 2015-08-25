var cheerio = require('cheerio');
var request = require('request');
var eachAsync = require('each-async');
var moment = require('moment');

module.exports = Gosu;
function Gosu(){}


/**
 * Callback for fetching match URLs
 *
 * @callback fetchUrlsCallback
 * @param {(null|string)} error - An error string
 * @param {array} An array of strings containing URLs
 */

/*
 * @param   {string} [game] - Game type
 * @param   {integer} [page=1] - Page number
 * @param   {fetchUrlsCallback} callback
 */
Gosu.fetchMatchUrls = function (game, page, callback){
	if (typeof game === 'function') { // Only required param
		var callback = game;
		var page = 1;
		game = null;
	} else if (typeof page === 'function'){ // Only 2 params
		var callback = page;
		if (typeof game === 'number' || !isNaN(parseInt(game, 10))) { // (page, callback)
			page = game;
			game = null;
		} else { // (game, callback)
			page = 1;
		}
	}
	// Check type of 'page'
	if (isNaN(page) || parseInt(Number(page)) != page || isNaN(parseInt(page, 10))) {
		return callback('Invalid page number');
	}

	// Map URLs to game types
	var gameSuffix = {
		csgo: '/counterstrike',
		dota2: '/dota2',
		hearthstone: '/hearthstone',
		hots: '/heroesofthestorm',
		lol: '/lol'
	}
	var urls = []; // result
	var requrl = 'http://www.gosugamers.net';
	if (game) {
		if (gameSuffix[game]) requrl = requrl + gameSuffix[game];
		else return callback('Unknown game type: '+game);
	}
	requrl = requrl + '/gosubet?r-page='+page;
	request(requrl, function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	  	var $ = cheerio.load(html);
	  	$('table.simple.matches tbody').each(function (i, element) {
	  		var table = cheerio.load(element);
		  	table('tr td a.match').each(function (i, element) {
		  		// Value bet enabled possibly?
		  		urls.push('http://www.gosugamers.net'+element.attribs.href);
		  	});
	  	});
	  	return callback(null, urls);
	  } else {
	  	return callback(error);
	  }
	});
}

/**
 * Callback for parsing match URLs
 *
 * @callback parseMatchCallback
 * @param {(null|string)} error - An error string
 * @param {object} Match data
 */

/*
 * @param    {string} url - The full URL to a Gosu match
 * @callback {parseMatchCallback} callback
 */
Gosu.parseMatch = function (url, callback){
	var match = {
		url: url,
		home: {},
		away: {},
		status: 'Unknown'
	};

	var type = url.split('/');
	match.type = type[3];

	request(url, function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	  	var $ = cheerio.load(html);
	  	match.home.name = $('.opponent1 h3 a').text();
	  	match.home.url  = $('.opponent1 h3 a').attr('href');
	  	match.home.country = $('.opponent1 .flag').attr('title');
	  	match.home.rank = parseInt($('.opponent1 .ranked').text().replace(/[^0-9\.]+/g, ''));
	  	match.away.name = $('.opponent2 h3 a').text();
	  	match.away.url = $('.opponent2 h3 a').attr('href');
	  	match.away.country = $('.opponent2 .flag').attr('title');
	  	match.away.rank = parseInt($('.opponent2 .ranked').text().replace(/[^0-9\.]+/g, ''));
	  	match.rounds = $('.bestof').text();

	  	if ($('#valuebet').index()) {
	  		match.valueBet = true;
	  	} else {
	  		match.valueBet = false;
	  	}

		// Matches that aren't live
	  	if ($('.vs .datetime').text()){
	  		var datetime = $('.vs .datetime').text().replace('/\n/g','').trim();
	  		// Timzones as strings don't work, so we have to add offsets manually
	  		if (datetime.indexOf('CEST') > -1) {
	  			datetime = datetime + ' +0200';
	  		} else if (datetime.indexOf('CET') > -1){
	  			datetime = datetime + ' +0100';
	  		}
	  		// Save as unix timestamp
	  		match.datetime = moment(datetime, 'MMMM DD, dddd, HH:mm Z').unix();

	  		// If match complete, record results
	  		if ($('.hidden.results').children().first().text()) {
	  			match.status = 'Complete';
	  			match.home.score = Number($('.hidden.results').children().first().text());
	  			match.away.score = Number($('.hidden.results').children().last().text());
	  		} else {
	  			match.status = 'Upcoming';
	  		}
	  	} else if ($('.vs .match-is-live').text()) { // Current Match
	  		match.status = 'Live';
	  	} else if ($('.upcomming')) { // Special case for upcoming matches with no scheduled time
	  		match.status = 'Upcoming';
	  	} else {
	  		return callback('Unknown match status');
	  	}

	  	return callback(null, match);
	  } else {
	  	return callback(error);
	  }
	});
}

/**
 * Callback for parsing match URLs
 *
 * @callback parseMatchesCallback
 * @param {(null|string)} error - An error string
 * @param {array} Array of objects containing match data
 */

/*
 * @param    {array} urls - An array containing full URLs to Gosu matches
 * @callback {parseMatchesCallback} callback
 */
Gosu.parseMatches = function (urls, callback){
	var self = this;
	var matches = [];
	eachAsync(urls, function (url, index, done) {
		self.parseMatch(url, function (err, match) {
			if (err) {
				done(err);
			} else {
				matches.push(match);
				done(null);
			}
		});
	}, function (err){
		if (err) {
			return callback(err)
		} else { // Success!
			return callback(null, matches);
		}
	});
}
