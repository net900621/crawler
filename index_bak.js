
 console.time('[WebSvr][Start]');
 
 //请求模块
var libHttp = require('http');    //HTTP协议模块
var orm = require("orm");
var _db;
var child = require('child_process');
var exec = child.exec;
var redis   = require('redis');
var client  = redis.createClient('6379', '127.0.0.1');
require('catch.js');

var opt = {
    host:     'localhost',
    database: 'srawler',
    user:     'root',
    password: '',
    protocol: 'mysql'
}

orm.connect(opt, function (err, db) {
	if (err) {
		console.log('error');
	};
	var MYTABLE = db.define('srawler', {
        link : {type: 'text'},
        descp : {type: 'text'}
    });
    _db = db;
});

//Web服务器主函数,解析请求,返回Web内容
var funWebSvr = function (req, res){  

    var _url = 'http://' + req.headers.host + req.url;
    _db.models['srawler'].find({'link' : _url}, function (err, items) {
    	
    	if (err) {

    		return ;
    	
    	}

    	if (items.length) {
            client.hexists(['crawlerDay', path], function(err, replies){
                if (replies) {
                    res.writeHead(200, {"Content-Type": "text/html" });
                    res.end(items[0].descp,'utf-8');
                }else{
                    exec("../bin/phantomjs reg.js " + _url, function (error, stdout, stderr) {
                        try{
                            var _out = JSON.parse(stdout);
                        }catch (e){
                            res.writeHead(404, {"Content-Type": "text/html" });
                            res.end('404 not found','utf-8');
                        }
                         _db.driver.execQuery(
                            "update srawler s set s.descp = '***' where s.link = '" + path + "';",
                            function (err, data) { 
                                console.log(data);
                            }
                        )
                        client.hset(["crawlerList", _url, 0], function(){});
                        res.writeHead(200, {"Content-Type": "text/html" });
                        res.end(_out.data,'utf-8');
                    });
                   
                    _db.models['srawler'].find([{'link' : path}]).each(function(rows) {

                        for(var i in _list){
                            rows[i] = _list[i];
                        }
                    }).save(function (err, items) {
                        if (err) {
                            global.cr --;
                            return 0;
                        };

                        global.cr --;
                        console.log(123)
                        global.crawlerFun(_data, _db, path);

                    });
                }
            })
    	}else{
    		exec("../bin/phantomjs reg.js " + _url, function (error, stdout, stderr) {
    			try{
					var _out = JSON.parse(stdout);
				}catch (e){
					res.writeHead(404, {"Content-Type": "text/html" });
        			res.end('404 not found','utf-8');
				}
				client.hset(["crawlerList", _url, 0], function(){});
    			res.writeHead(200, {"Content-Type": "text/html" });
        		res.end(_out.data,'utf-8');
    		});
    	}

    });
}
 

var webSvr=libHttp.createServer(funWebSvr);


webSvr.on("error", function(error) { 
    console.log(error);
}); 

webSvr.listen(6001,function(){

    console.log('[WebSvr][Start] running at http://127.0.0.1:6001/'); 

    console.timeEnd('[WebSvr][Start]');
});