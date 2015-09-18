var orm = require("orm");
var system = require('system');
var host = 'http://m.meilishuo.com';

var opt = {
    host:     'localhost',
    database: 'srawler',
    user:     'root',
    password: '',
    protocol: 'mysql'
}

orm.connect(opt, function (err, db) {
    var MYTABLE = db.define('srawler', {
        name : {type: 'text'}
    });
    db.driver.execQuery(
	  "truncate table ?;",
	  ['srawler'],
	  function (err, data) { 
	  	console.log(data);
	  }
	)
});