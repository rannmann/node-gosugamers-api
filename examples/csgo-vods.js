var Gosu = require("../gosuapi.js");
Gosu.fetchVodUrls('csgo' , function(err,urls){
	console.log(urls);

});
