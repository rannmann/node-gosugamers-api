# GosuGamers API for Node.js
[![forthebadge](http://forthebadge.com/images/badges/no-ragrets.svg)](http://forthebadge.com)

This module makes grabbing and parsing match data from GosuGamers.net simple.  All methods are static, so no need to instantiate.


# Methods

### fetchMatchUrls([game,] [page,] callback)
Returns a list of URLs for a game type.  If no game is provided, the home page is used which returns Live/Upcoming/Recent matches of all available types.

- **game**: One of the following: `null`, `csgo`, `dota2`, `hearthstone`, `hots`, `lol`.  Defaults to `null`.
- **page**: An integer, string representing an integer, or `null`
- **callback**: Function that takes two parameters:
  - **error**: `null` or `String` error message
  - **URLs**: `Array` of strings containing full URLs to each match on the page



### parseMatch(url, callback)
Given a URL an object containing match information is returned.  Matches that are currently live have no `datetime` attribute.  Matches that have not completed do not have score information.

- **url**: A GosuGamers URL string
- **callback**: Function that takes two parameters:
  - **error**: `null` or `String` error message
  - **match**: `Object` of match data

See the example match data below.

    {
        url: 'http://www.gosugamers.net/dota2/tournaments/7067-the-international-2015/1902-group-stage/7070-group-b/matches/84807-virtus-pro-dota2-vs-vici-gaming',
        home: { name: 'Virtus Pro-Dota2', score: 1 },
        away: { name: 'Vici Gaming', score: 1 },
        status: 'Complete',
        type: 'dota2',
        rounds: 'Best of 2',
        valueBet: true,
        datetime: 1438212600
    }



### parseMatches(urls, callback)
Same as `parseMatch` except given an array of URLs it returns an array of matches.  All matches are requested asynchronously.  If you request too many at a time you're likely to be rate-limited and this will fail.

- **urls**: An `Array` of URLs
- **callback**: Function that takes two parameters:
  - **error**: `null` or `String` error message
  - **match**: `Array` of objects containing match data