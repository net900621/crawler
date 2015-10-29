var page = require('webpage').create(),
	libFs = require("fs");
var _d = +(new Date())
page.open('http://m.meilishuo.com/sq', function (status) {
    var _data = page.evaluate(function () {
    	var _html = document.getElementsByTagName('html')[0],
	    scrpt = _html.getElementsByTagName('script'),
	    _scrpt = Array.prototype.slice.call(scrpt);
		Array.prototype.forEach.call(_scrpt, function(v, i){
			scrpt[0].parentNode.removeChild(scrpt[0]);
		});
        return '<html>' + _html.innerHTML + '</html>';
    });
    var _tmp = './tmp/' + Date.now().toString();
    libFs.write(_tmp, _data.replace(/[\n\t]/g, '').replace(/\<script[^\>]*\>([^\<\/script\>]*)\<\/script\>/g,''), 'w');
    console.log(+(new Date()) - _d)
    phantom.exit();
});
