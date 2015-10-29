var cluster = require('cluster'),
    cpusNum = require('os').cpus().length || 24;

cluster.setupMaster({
    exec : './fork_api.js',
    silent : false
})

for(var i = cpusNum ; i--;){
    cluster.fork()
}

cluster.on('exit', function (worker, code, signal) {
    console.log('[master] ' + 'exit worker' + worker.id + ' died')
    cluster.fork()
})