var config = require("./config/config.js")
var redis_conf = config.redis_config;
var opt = config.opt;
var redis   = require('redis');
var client  = redis.createClient(redis_conf.ip, redis_conf.port);
var child = require('child_process');
var exec = child.exec;
var fs = require("fs");
var host = 'http://www.meilishuo.com';
var urlM = require('url');
global.num = 1;
global.cr = 1;
var orm = require("orm");
var cluster = require('cluster');
var numCPUs = require('os').cpus().length || 24;
var _db;

fs.createWriteStream(process.cwd() + "/config/pids", {
flags: "a",
encoding: "utf-8",
mode: 0666
}).write(process.pid + "\n");


orm.connect(opt, function (err, db) {
	if (err) {
		global.cr --;
		return 0;
	};
	var MYTABLE = db.define('srawler', {
        link : {type: 'text'},
        descp : {type: 'text'}
    });
    _db = db;
});

var crawler = function(path){

	var host = 'http://' + urlM.parse(path).host;

	var res = exec("../bin/phantomjs reg.js " + path, function (error, stdout, stderr) {
		
		if (!stdout || error) {
			global.cr --;
			return 0;
		};
		try{
			var _out = JSON.parse(stdout);
		}catch (e){
			global.cr --;
			console.log(e.message)
		}
		if (!error) {

			var _data = _out.data;

			client.HGET("crawlerList", path, function (err, replies) {
			    if (!replies) {

				    _db.models['srawler'].find({'link' : path}, function (err, items) {
				    	

			    		if (err) {
							global.cr --;
							return 0;
						};
						dbChance(_out, items, path, host);
						
					});

		       	};
			});

			
			client.hset(["crawlerList", path, 1], function(){});

			return 0;
		};
	});  
}


if (cluster.isMaster) {
	client.hset(["crawlerList", 'http://www.meilishuo.com', 0], function(){});
	client.hset(["crawlerList", 'http://m.meilishuo.com', 0], function(){});
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

			global.num = 0;
			client.hkeys("crawlerList", function (err, replies) {

				global.num = 1;
				
				var _r = replies[0];
				if (_r) {
					global.cr ++;
					client.hdel("crawlerList", replies[0],function(){});
					crawler(_r);
				};
			});
		};
			
	}, 100)
}


var crawlerFun = function(_data, _db, path, host){

	//for crawler
    var _crawler = _data.split(/href/),
        _url = '';
    _crawler.splice(0, 1)
    _crawler.forEach(function(v, i){
        
        _url = v.replace(/^[\W]*\="([^"]*)"[\w\W]*/,'$1');

        if (_url.match(/^http:\/\/(www|m)\.meilishuo\.com/) || _url.match(/^\//)) {

            if (_url.match(/^\//)) _url = host + _url;
            var fuck_url = _url.replace(/\&amp;/g, '&');

            _db.models['srawler'].find({'link' : fuck_url}, function (err, items) {

            	if (!items.length) {
                	fuck_url = fuck_url.replace(/\&amp;|\&/g, '~')

                    client.hset(["crawlerList", fuck_url, 0], function(){}); 

            	}
            })
        
        };
    });

    client.hset(["crawlerDay", path, 0], function(){}); 
}

var dbChance = function(_out, items, path, host){

	var _data = _out.data;

	var _list = [{'link' : _out.tmp,'descp' : _out.data}];

	if (!items.length) {
		_db.models['srawler'].create(_list, function (err, items) {
    		if (err) {
				global.cr --;
				return 0;
			};

			global.cr --;
    		
    		crawlerFun(_data, _db, path ,host);

		});

	}else{

		client.hexists(['crawlerDay', path], function(err, replies){
		
			if (!replies) {

				_db.models['srawler'].find({'link' : path} , function(err, rows) {

					rows[0].descp = _list[0].descp;
					rows[0].save(function (err, items) {
				  		
			    		if (err) {
							global.cr --;
							return 0;
						};

						global.cr --;

			    		crawlerFun(_data, _db, path ,host);

					});
			  	})

			};
		})
	}
}