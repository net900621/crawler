var page = require('webpage').create(),
	libFs = require("fs");
var util = require('util');
var mysql = require("mysql");
var system = require('system');
var host = 'http://m.meilishuo.com';

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'srawler'
});


var writeSeo = function(path){
    path = path.replace(/\~/g, '&');
    page.open(path, function (status) {
        var _data = page.evaluate(function () {
            var _html = document.getElementsByTagName('html')[0].innerHTML;
            return '<html>' + _html.replace(/<script[^>]*>.*?<\/script>/g, '') + '</html>';
        });
        if (path.match(/^\//)) path = host + path;
        var _tmp = './tmp/' + path.replace(/http:\/\/(.*)\.meilishuo.com/, '$1').replace(/\/$/, '');
        _tmp = _tmp.replace(/\&amp;|\&/g, '~')
        _tmp += '.html'
        if (!libFs.exists(_tmp)){
            libFs.write(_tmp, _data, 'w');
        }
        phantom.exit();
    });
}

writeSeo(system.args[1]);
