var libFs = require("fs"),
    host = 'http://m.meilishuo.com';

var page = require('webpage').create();    
var writeSeo = function(path){

    page.open(path, function (status) {
        var _data = page.evaluate(function () {
            var _html = document.getElementsByTagName('html')[0].innerHTML,
            _arr = _html.split('/script>'),
            _result = '';
            _arr.forEach(function(v, i){
                _result += v.split('<script')[0];
            });

            return '<html>' + _result + '</html>';
        });
        //for crawler
        var crawler = _data.split(/href/),
            _url = '';
        crawler.splice(0, 1)
        crawler.forEach(function(v, i){
            _url = v.replace(/^[\W]*\="([^"]*)"[\w\W]*/,'$1');
            console.log(_url)
            console.log('<<<<<<<<<<<<<')
            if (_url.match(/meilishuo\.com/) || _url.match(/^\//)) {
                // console.log(_url);
                if (_url.match(/^\//)) _url = host + _url;
                var _tmp = './tmp/' + _url.replace(/http:\/\/(.*)\.meilishuo.com/, '$1');
                if (!libFs.exists(_tmp))
                    writeSeo(_url)
            };
        });

        var _tmp = './tmp/' + path.replace(/http:\/\/(.*)\.meilishuo.com/, '$1');
        if (!libFs.exists(_tmp))
            libFs.write(_tmp, _data, 'w');
        page.close();
    });
}
writeSeo('http://m.meilishuo.com/sq')
