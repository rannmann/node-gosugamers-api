var Gosu = require("../index.js");
Gosu.fetchVodUrls('csgo' , function(err,urls){
	console.log(urls);
});
