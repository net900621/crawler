var exec = require('child_process').exec;
var fs = require("fs");
var host = 'http://m.meilishuo.com';
var mysql = require("mysql");

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'srawler'
});

var crawler = function(path){
	var res = exec("../bin/phantomjs reg.js " + path, function (error, stdout, stderr) {
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

	            if (_url.match(/^http:\/\/m\.meilishuo\.com\/sq/) || _url.match(/^\//)) {

	                if (_url.match(/^\//)) _url = host + _url;
	                var _tmp = './tmp/' + _url.replace(/http:\/\/(.*)\.meilishuo.com/, '$1').replace(/\/$/, '');
	                _tmp += '.html';
	                fs.existsSync(_tmp.replace(/\&amp;|\&/g, '~'))
	                if (!fs.existsSync(_tmp.replace(/\&amp;|\&/g, '~'))){
	                	_url = _url.replace(/\&amp;|\&/g, '~')
						console.log(_url)
	                    crawler(_url);
	                    console.log('<<<<<<<<<<<')
	                }
	            
	            };
	        });
		};
	});  
}
crawler('http://m.meilishuo.com/sq')