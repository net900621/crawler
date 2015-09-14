var page = require('webpage').create(),
	libFs = require("fs");
var _d = +(new Date())
page.open('http://m.meilishuo.com/sq', function (status) {
    var _data = page.evaluate(function () {
        console.log(document.getElementsByTagName('html')[0])
    	var _html = document.getElementsByTagName('html')[0].innerHTML,
	    _arr = _html.split('/script>'),
        _result = '';
        _arr.forEach(function(v, i){
            _result += v.split('<script')[0];
        })
        return '<html>' + _result + '</html>';
    });
    var _tmp = './tmp/' + Date.now().toString();
    libFs.write(_tmp, _data, 'w');
    console.log(+(new Date()) - _d)
    phantom.exit();
});
