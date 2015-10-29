var orm = require("orm");
var host = 'http://m.meilishuo.com';
var redis   = require('redis');
var config = require("./config/config.js")
var redis_conf = config.redis_config;
var opt = config.opt;
var client  = redis.createClient(redis_conf.ip, redis_conf.port);

// orm.connect(opt, function (err, db) {
//     var MYTABLE = db.define('srawler', {
//         link : {type: 'text'},
//         descp : {type: 'text'}
//     });
//     db.driver.execQuery(
// 	  "truncate table srawler;",
// 	  function (err, data) { 
// 	  	console.log(data);
// 	  }
// 	)
// });
// client.del("crawlerList", function(){})
client.del("crawlerDay", function(){})
client.hkeys("crawlerDay", function (err, replies) {
    console.log(replies);
    client.quit();
});