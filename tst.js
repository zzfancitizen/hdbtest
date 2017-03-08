var http = require('http');
var vsprintf = require('sprintf-js').vsprintf;

var server = http.createServer().listen(5050);

server.on('request', function (req, res) {
    if (req.method == 'PUT') {
        req.on('data', function (chunk) {
            var time = JSON.parse(chunk.toString()).time.split(':');
            var rule = time[2] + ' ' + time[1] + ' ' + time[0];
            console.log(rule);
        })
    }
})