var page = require('webpage').create(),
	libFs = require("fs");
var system = require('system');
var host = 'http://m.meilishuo.com';

var writeSeo = function(path){
    path = path.replace(/\~/g, '&');
    page.open(path, function (status) {
        var _data = page.evaluate(function () {
            var _html = document.getElementsByTagName('html')[0].innerHTML;
            return '<html>' + _html.replace(/<script[^>]*>.*?<\/script>/g, '') + '</html>';
        });
        system.stdout.writeLine(JSON.stringify({
            'tmp' : path,
            'data' : _data
        }));
        // if (!libFs.exists(_tmp))
        //     libFs.write(_tmp, _data, 'w');
        phantom.exit();
    });
}

writeSeo(system.args[1]);