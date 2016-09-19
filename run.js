var Gosu = require('./index');
Gosu.fetchRank('overwatch', function(err, ranks) {
    console.log(ranks);
});
