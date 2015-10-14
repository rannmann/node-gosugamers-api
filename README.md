[![forthebadge](http://forthebadge.com/images/badges/no-ragrets.svg)](http://forthebadge.com)
[![Dependency Status](https://david-dm.org/rannmann/node-gosugamers-api.svg)](https://david-dm.org/rannmann/node-gosugamers-api)
[![Build Status](https://travis-ci.org/rannmann/node-gosugamers-api.svg?branch=master)](https://travis-ci.org/rannmann/node-gosugamers-api)

# GosuGamers API for Node.js
This module makes grabbing and parsing match data from GosuGamers.net simple.  All methods are static, so no need to instantiate.

# Setup
Install via `npm install gosugamers-api`.

Use in your project just by including the module and running the methods.

```javascript
var Gosu = require('gosugamers-api');

Gosu.fetchMatchUrls('dota2', function(err, urls) {
  console.log(urls);
});
```

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
        url: 'http://www.gosugamers.net/dota2/tournaments/7331-hitbox-eu-championship-3/matches/86826-team-alternate-dota-2-vs-myinsanity',
        home:
         { name: 'Team Alternate Dota 2',
           url: '/dota2/teams/12074-team-alternate-dota-2',
           country: 'Poland',
           rank: 62,
           score: 2 },
        away:
         { name: 'mYinsanity',
           url: '/dota2/teams/2820-myinsanity',
           country: 'Serbia',
           rank: 84,
           score: 1 },
        status: 'Complete',
        type: 'dota2',
        rounds: 'Best of 3',
        valueBet: true,
        datetime: 1440522000
    }



### parseMatches(urls, callback)
Same as `parseMatch` except given an array of URLs it returns an array of matches.  All matches are requested asynchronously.  If you request too many at a time you're likely to be rate-limited and this will fail.

- **urls**: An `Array` of URLs
- **callback**: Function that takes two parameters:
  - **error**: `null` or `String` error message
  - **match**: `Array` of objects containing match data
