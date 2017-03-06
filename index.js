const wrap = require('./windmillWrap').windmillWrap;
const http = require('http');

var server = http.createServer().listen(8080);

server.on('request', function (req, res) {
    var wrapRes = wrap();
    if (wrapRes.error) {
        res.writeHead(500);
        res.end();
    } else {
        res.writeHead(200, {"Content-Type": 'text/plain'});
        wrapRes.value.forEach(function (val) {
            res.write(val);
        });
        res.end();
    }
});


