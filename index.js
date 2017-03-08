const wrap = require('./windMillWrapPoc').wrapWindMill;
const http = require('http');

var server = http.createServer().listen(8080);

server.on('request', function (req, res) {
    // console.log(req.method);
    if (req.method == 'GET') {
        wrap.then(function (val) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(val));
                res.end();
            }
        )
        .catch(
            function (err) {
                res.writeHead(500);
                res.end();
            }
        )
    }
});


