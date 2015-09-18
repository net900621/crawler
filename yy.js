var redis   = require('redis');
var client  = redis.createClient('6379', '127.0.0.1');
var exec = require('child_process').exec;
var fs = require("fs");
var host = 'http://www.meilishuo.com';
global.num = 1;
global.cr = 1;

var crawler = function(path){
	var res = exec("../bin/phantomjs reg.js " + path, function (error, stdout, stderr) {
		global.cr --;
		if (!error) {
			if (path.match(/^\//)) path = host + path;
			var _tmp = './tmp/' + path.replace(/http:\/\/(.*)\.meilishuo.com/, '$1').replace(/\/$/, '');

			var _data = '';
			_tmp = _tmp.replace(/\&amp;|\&/, '~')
			_tmp += '.html';
			if (fs.existsSync(_tmp))
				_data = fs.readFileSync(_tmp, "utf8");

			//for crawler
	        var _crawler = _data.split(/href/),
	            _url = '';
	        _crawler.splice(0, 1)
	        _crawler.forEach(function(v, i){
	            
	            _url = v.replace(/^[\W]*\="([^"]*)"[\w\W]*/,'$1');

	            if (_url.match(/^http:\/\/www\.meilishuo\.com/) || _url.match(/^\//)) {

	                if (_url.match(/^\//)) _url = host + _url;
	                var _tmp = './tmp/' + _url.replace(/http:\/\/(.*)\.meilishuo.com/, '$1').replace(/\/$/, '');
	                _tmp += '.html';
	                fs.existsSync(_tmp.replace(/\&amp;|\&/g, '~'))
	                if (!fs.existsSync(_tmp.replace(/\&amp;|\&/g, '~'))){
	                	_url = _url.replace(/\&amp;|\&/g, '~')
	                    client.hset(["crawlerList", _url, 0], function(){}); 
	                    // crawler(_url);
	                }
	            
	            };
	        });
		};
	});  
}
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
		
}, 10)
crawler('http://www.meilishuo.com')
	