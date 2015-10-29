
 console.time('[WebSvr][Start]');
 
 //请求模块
var libHttp = require('http');    //HTTP协议模块
var orm = require("orm");
var config = require("./config/config.js")
var redis_conf = config.redis_config;
var opt = config.opt;
var libFs = require("fs");
var _db;
var child = require('child_process');
var exec = child.exec;
var redis   = require('redis');
var client  = redis.createClient(redis_conf.ip, redis_conf.port);

global.logWrite = require("./log");



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
    try{
        var _url = 'http://' + req.headers.host + req.url;
        var logDir = writeLog();
        logWrite.logShow(logDir.replace('/tmp/log/phantom/', '/tmp/log/phantom-access/'), _url, (new Date()).toLocaleTimeString(), 200);
        _db.models['srawler'].find({'link' : _url}, function (err, items) {
            
            if (err) {

                return ;
            
            }
            
            if (items.length) {
                logWrite.logShow(logDir, _url, (new Date()).toLocaleTimeString(), 200);
                res.writeHead(200, {"Content-Type": "text/html" });
                res.end(items[0].descp,'utf-8');
            }else{
                exec("../bin/phantomjs reg.js " + _url, function (error, stdout, stderr) {
                    try{
                        var _out = JSON.parse(stdout);
                    }catch (e){
                        logWrite.logShow(logDir, _url, (new Date()).toLocaleTimeString(), 404);
                        res.writeHead(404, {"Content-Type": "text/html" });
                        res.end('404 not found','utf-8');
                    }
                    client.hset(["crawlerList", _url, 0], function(){});
                    logWrite.logShow(logDir, _url, (new Date()).toLocaleTimeString(), 200);
                    res.writeHead(200, {"Content-Type": "text/html" });
                    res.end(_out && _out.data,'utf-8');
                });
            }

        });
    }catch(e){
        logWrite.logShow(logDir, _url, (new Date()).toLocaleTimeString(), 404);
        res.writeHead(404, {"Content-Type": "text/html" });
        res.end(e.message,'utf-8');
    }
        
}
 

var webSvr=libHttp.createServer(funWebSvr);


webSvr.on("error", function(error) { 
    console.log(error);
}); 

webSvr.listen(6001,function(){

    console.log('[WebSvr][Start] running at http://127.0.0.1:6001/'); 

    console.timeEnd('[WebSvr][Start]');
});

var writeLog = function(){
    var date = new Date(),
        dataUrl = '';

    try{

        if (!libFs.existsSync('/tmp/log/phantom/')) {

            libFs.mkdirSync('/tmp/log/phantom/');
            
        }

        if (!libFs.existsSync('/tmp/log/phantom-access/')) {

            libFs.mkdirSync('/tmp/log/phantom-access/');
            
        }

        if (!libFs.existsSync('/tmp/log/phantom/' + date.getUTCFullYear())) {

            libFs.mkdirSync('/tmp/log/phantom/' + date.getUTCFullYear());

        }
        if (!libFs.existsSync('/tmp/log/phantom-access/' + date.getUTCFullYear())) {

            libFs.mkdirSync('/tmp/log/phantom-access/' + date.getUTCFullYear());

        }


        var monthValue = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1);
        
        if (!libFs.existsSync('/tmp/log/phantom/' + date.getUTCFullYear() + '/' + monthValue)) {

            libFs.mkdirSync('/tmp/log/phantom/' + date.getUTCFullYear() + '/' + monthValue);

        }

        if (!libFs.existsSync('/tmp/log/phantom-access/' + date.getUTCFullYear() + '/' + monthValue)) {

            libFs.mkdirSync('/tmp/log/phantom-access/' + date.getUTCFullYear() + '/' + monthValue);

        }

        var dayValue = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate();

        dataUrl = '/tmp/log/phantom/' + date.getUTCFullYear() + '/' + monthValue + '/' + dayValue;

    }catch(e){
        console.log(e.message);
        console.log(e.stack);
    }

    return dataUrl;
}