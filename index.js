var cheerio = require('cheerio');
var request = require('request');
var eachAsync = require('each-async');
var moment = require('moment');

module.exports = new Gosu();
function Gosu(){
	this.gameSuffix = {
		csgo: '/counterstrike',
		dota2: '/dota2',
		hearthstone: '/hearthstone',
		hots: '/heroesofthestorm',
		lol: '/lol',
		overwatch: '/overwatch'
	}
	this.requrl = 'http://www.gosugamers.net';
}
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
Gosu.prototype.fetchMatchUrls = function (game, page, callback){
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
	if (page === null) {
		page = 1;
	} else if (isNaN(page) || parseInt(Number(page)) != page || isNaN(parseInt(page, 10))) {
		return callback('Invalid page number');
	}

	var urls = []; // result
	var requrl = this.requrl;
	if (game) {
		if (this.gameSuffix[game]) requrl = requrl + this.gameSuffix[game];
		else return callback('Unknown game type: '+game);
	}
	else {
		return callback('Unknown game type: '+game);
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
 * Callback for fetching VOD URLs
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
Gosu.prototype.fetchVodUrls = function (game, page, callback){
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
	if (page === null) {
		page = 1;
	} else if (isNaN(page) || parseInt(Number(page)) != page || isNaN(parseInt(page, 10))) {
		return callback('Invalid page number');
	}

	var urls = []; // result
	var requrl = this.requrl;
	if (game) {
		if (this.gameSuffix[game]) requrl = requrl + this.gameSuffix[game] + '/vods';
		else return callback('Unknown game type: '+game);
	}
	else {
		return callback('Unknown game type: '+game);
	}
	request(requrl, function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	  	var $ = cheerio.load(html);
			//Get to the table that has all the match information
	  	$('.content .simple tbody').each(function (i, element) {
	  		var table = cheerio.load(element);
				//Get to the <a tag that has the URL to the vod of the match
		  	table('tr td a.video').each(function (i, element) {
					//split the link to remove the ?vodid off the end. usefull when returning the array because we can sort and uniq them
					var temp = element.attribs.href.split(/[?]/);
		  		urls.push('http://www.gosugamers.net'+temp[0]);
		  	});
	  	});

			//Function to sort and return only unique entries
			function sort_unique(arr) {
			arr = arr.sort(function (a, b) { return a*1 - b*1; });
			var ret = [arr[0]];
			for (var i = 1; i < arr.length; i++) { // start loop at 1 as element 0 can never be a duplicate
					if (arr[i-1] !== arr[i]) {
							ret.push(arr[i]);
					}
			}
			return ret;
	}
		//Sort the urls and only return uniq entries (ie no duplicates) as the parseMatch function will get all VODS on a page so
		//dont need all the extra urls for each match (for multi round matches)
		 var sortedurls = sort_unique(urls);
	  	return callback(null, sortedurls);
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
Gosu.prototype.parseMatch = function (url, callback){
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
			match.tournament = $('.match-heading-overlay h1 a').text();
			match.tournamenturl = $('.match-heading-overlay h1 a').attr('href');
			//var str = $('.gg-row .col-12 .dark-buttons.matches-stream-options .matches-streams span textarea iframe').attr('src');
			//match.vods.url = str.substring(str.lastIndexOf("/")+1,str.lastIndexOf("?"));
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
					var urls = $('.matches-streams span textarea iframe');
					var index;
					match.vods = [];
					if (urls.length == 0){
						match.vods.push("No VODs found for this match");
					}else{
						for (index = 0;index < urls.length; ++index){
							match.vods.push(urls[index].attribs.src.split(/[/?]/)[4]);
						}
				  }
	  		} else {
	  			match.status = 'Upcoming';
	  		}
	  	} else if ($('.vs .match-is-live').text()) { // Current Match
	  		match.status = 'Live';
				var twitch = $('.matches-streams .match-stream-tab object').attr('data').split("=")[1];
				var twitchurl = "www.twitch.tv/"+twitch;
				match.livestream = twitchurl;
				//match.vods.push(twitchurl);

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
Gosu.prototype.parseMatches = function (urls, callback){
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
