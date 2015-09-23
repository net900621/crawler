var redis   = require('redis');
var client  = redis.createClient('6379', '127.0.0.1');
var child = require('child_process');
var exec = child.exec;
var fs = require("fs");
var host = 'http://www.meilishuo.com';
global.num = 1;
global.cr = 1;
var orm = require("orm");
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var opt = {
    host:     'localhost',
    database: 'srawler',
    user:     'root',
    password: '',
    protocol: 'mysql'
}

var crawler = function(path){
	var res = exec("../bin/phantomjs reg.js " + path, function (error, stdout, stderr) {
		if (!stdout || error) {
			return 0;
		};
		try{
			var _out = JSON.parse(stdout);
		}catch (e){
			console.log(e.message)
		}
		global.cr --;
		if (!error) {

			var _data = _out.data;
			orm.connect(opt, function (err, db) {
				if (err) {
					return 0;
				};
				var MYTABLE = db.define('srawler', {
			        link : {type: 'text'},
			        descp : {type: 'text'}
			    });
			    db.models['srawler'].find({'link' : path}, function (err, items) {
		    		
		    		if (!items.length) {

		    			db.models['srawler'].create([{'link' : _out.tmp,'descp' : _out.data}], function (err, items) {
				    		
				    		//for crawler
					        var _crawler = _data.split(/href/),
					            _url = '';
					        _crawler.splice(0, 1)
					        _crawler.forEach(function(v, i){
					            
					            _url = v.replace(/^[\W]*\="([^"]*)"[\w\W]*/,'$1');

					            if (_url.match(/^http:\/\/www\.meilishuo\.com/) || _url.match(/^\//)) {

					                if (_url.match(/^\//)) _url = host + _url;
					                var fuck_url = _url.replace(/\&amp;/g, '&');
					                db.models['srawler'].find({'link' : fuck_url}, function (err, items) {
					                	// console.log(items)
					                	if (!items.length) {
						                	fuck_url = fuck_url.replace(/\&amp;|\&/g, '~')
						                	// console.log(_url)
						                    client.hset(["crawlerList", fuck_url, 0], function(){}); 
						                    // console.log('<<<<<<<<<<<')
					                	}
					                })
					            
					            };
					        });

						});

		    		};
				});

			});
			return 0;
		};
	});  
}
if (cluster.isMaster) {
	client.hset(["crawlerList", 'http://www.meilishuo.com', 0], function(){}); 
	for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
	}

    cluster.on('death', function(worker) {
        cluster.fork();
	});
    cluster.on('exit', function(worker) {
		cluster.fork();
	});
} else {
	setInterval(function(){
		if (global.num && global.cr < 20) {
			// console.log(global.cr)
			global.num = 0;
			client.hkeys("crawlerList", function (err, replies) {
				global.num = 1;
				// console.log(replies.length, global.cr)
				var _r = replies[0];
				if (_r) {
					global.cr ++;
					client.hdel("crawlerList", replies[0],function(){});
					crawler(_r);
				};
			});
		};
			
	}, 10)
}
	