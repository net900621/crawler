var redis   = require('redis');
var client  = redis.createClient('6379', '127.0.0.1');

// client.hset("e", "hashtest 1", "1", function(){});  
// client.hset(["e", "hashtest 2", "0"], function(){});  
// client.hset(["e", "hashtest 3", "1"], function(){});
client.lpush("a", "123", redis.print);
client.lpush("a", "111", redis.print);
client.rpop("a", function(err, tr){
console.log(tr)
})