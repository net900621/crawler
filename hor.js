var phridge = require('phridge');
var host = 'http://m.meilishuo.com';

var phridgeTo = function(path){
	var path = path;
	phridge.spawn().then(function (phantom) {
		path = path.replace(/\~/g, '&');
	    return phantom.openPage(path || "http://www.meilishuo.com");
	}).then(function (page) {

	    return page.run(function () {
	    	console.log(this.evaluate)
	    	this.evaluate(function () {
	            var _html = document.getElementsByTagName('html')[0].innerHTML;
	            console.log(_html)
	            return '<html>' + _html.replace(/<script[^>]*>.*?<\/script>/g, '') + '</html>';
	        });
			var _data = this.evaluate(function () {
	            var _html = document.getElementsByTagName('html')[0].innerHTML;
	            console.log(_html)
	            return '<html>' + _html.replace(/<script[^>]*>.*?<\/script>/g, '') + '</html>';
	        });
	        return _data;
	        phantom.exit();

	    });
	})

}
phridgeTo('http://www.meilishuo.com');
exports.phridgeTo = phridgeTo;