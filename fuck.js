var redis   = require('redis');
var client  = redis.createClient('6379', '127.0.0.1');
client.on("message", function (channel, message) {
    console.log("client1 channel " + channel + ": " + message);
    msg_count += 1;
    if (msg_count === 3) {
        client.unsubscribe();
        client.end();
    }
});