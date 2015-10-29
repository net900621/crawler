var system = require('system')




var page = require('webpage').create()

~function(){
	function loop() {
		// stdin.readLine() is sync and halts until a whole line is read
		var line = system.stdin.readLine().trim()
		openURL(line)
		setTimeout(loop, 500)
	}

	loop()
}()


function openURL(url){
	console.log('toopen' , url)
	url = 'http://www.baidu.com'
	page.open(url, function(status){
		if ('success' == status ) {
			var content = page.content
		}
		var msg = {'url' : url
				,'status': 'success' ==  status
				, 'content': content}
		system.stdout.writeLine(JSON.stringify(msg))
		phantom.exit()
	})
}