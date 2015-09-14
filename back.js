var libFs = require("fs"),
    host = 'http://m.meilishuo.com';
var writeSeo = function(path, _c){
    var page = require('webpage').create();
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
            _url = '',
            _num = crawler.length - 1;
        crawler.splice(0, 1)
        crawler.forEach(function(v, i){

            _url = v.replace(/^[\W]*\="([^"]*)"[\w\W]*/,'$1');
            if (_url.match(/meilishuo\.com/) || _url.match(/^\\/)) {

                if (_url.match(/^\\/)) _url = host + _url;
                console.log(_url)
                console.log('<<<<<<<<<<<<<')
                var _tmp = './tmp/' + _url.replace(/http:\/\/(.*)\.meilishuo.com/, '$1');
                if (!libFs.exists(_tmp))
                    writeSeo(_url,function(){
                        cbk();
                    })

            }else{
                _num --;
            }

        });

        var cbk = function(){
            console.log(_num)
            _num --;
            if (!_num) {
                var _tmp = './tmp/' + path.replace(/http:\/\/(.*)\.meilishuo.com/, '$1');
                if (!libFs.exists(_tmp))
                    libFs.write(_tmp, _data, 'w');
            };

        }
        _c();
        // phantom.exit();
    });
}
writeSeo('http://m.meilishuo.com/sq', function(){
    var _tmp = './tmp/' + path.replace(/http:\/\/(.*)\.meilishuo.com/, '$1');
    if (!libFs.exists(_tmp))
        libFs.write(_tmp, _data, 'w');
})
