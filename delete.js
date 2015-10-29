var orm = require("orm");
var host = 'http://m.meilishuo.com';
var redis   = require('redis');
var client  = redis.createClient('6379', '127.0.0.1');

var opt = {
    host:     'localhost',
    database: 'srawler',
    user:     'root',
    password: '',
    protocol: 'mysql'
}

orm.connect(opt, function (err, db) {
    var MYTABLE = db.define('srawler', {
        link : {type: 'text'},
        descp : {type: 'text'}
    });
    db.driver.execQuery(
	  "truncate table srawler;",
	  function (err, data) { 
	  	console.log(data);
	  }
	)
});
client.del("crawlerList", function(){})
client.hkeys("crawlerList", function (err, replies) {
    console.log(replies);
    client.quit();
});