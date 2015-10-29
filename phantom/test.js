var orm = require("orm");
var host = 'http://m.meilishuo.com';
var redis   = require('redis');
var config = require("./config/config.js")
var redis_conf = config.redis_config;
var opt = config.opt;
var client  = redis.createClient(redis_conf.ip, redis_conf.port);

orm.connect(opt, function (err, db) {
    var MYTABLE = db.define('srawler', {
        link : {type: 'text'},
        descp : {type: 'text'}
    });
 //    db.driver.execQuery(
	//     "update srawler s set s.descp = 123 where s.link = 'http://www.meilishuo.com/share/item/3817036299';",
	//     function (err, data) { 
	//         console.log(data);
	//     }
	// )
});
// client.del("crawlerList", function(){})
// client.del("crawlerDay", function(){})
client.hset(["crawlerList", 'http://www.meilishuo', 1], function(){});
// client.hset(["crawlerList", 'http://www.meilishuo', 'www'], function(err, replies){
// 	console.log(replies);
// 	client.HGET(["crawlerDay", 'http://www.meilishuo'], function (err, replies) {
// 	    console.log(replies);
// 	    client.quit();
// 	});
// });
client.hget("crawlerList", 'http://www.meilishuo',function (err, replies) {
	console.log(123)
    console.log(replies);
    console.log(321)
    client.quit();
});

