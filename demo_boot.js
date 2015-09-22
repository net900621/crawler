var path = require('path')
var worker_path = path.resolve(__dirname ,'demo_worker.js')
var child = require('child_process').exec('../bin/phantomjs ' + worker_path, {'maxBuffer' : 2000000*1024})
child.stdout.on('data' , function(data){
	data = data.toString('utf8').trim()

	console.log('receive ' , (data))
	try{
		console.log('receive' , JSON.parse(data))
	}catch(err){}
})
child.stdout.on('close' , function(){
	console.log('close' )
})

setTimeout(function(){
	child.stdin.write("http://www.baidu.com\n");
} ,100)