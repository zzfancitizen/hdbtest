const wrap = require('./windMillWrapPoc').wrapWindMill;
const http = require('http');
const schedule = require('node-schedule');
const cron = require('cron');

var CronJob = cron.CronJob;

var server = http.createServer().listen(8080);

server.on('request', function (req, res) {
    if (req.method == 'GET') {
        wrap.then(function (val) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(val));
                res.end();
            }
        )
            .catch(
                function (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.write(err);
                    res.end();
                }
            )
    }
    ;
    if (req.method == 'POST') {
        new CronJob('* * * * * *', function () {
            console.log('You will see this message every second');
        }, null, true, 'America/Los_Angeles');
        res.writeHead(200, {'Content-Type': 'test/plain'});
        res.write('Job scheduled');
        res.end();
    }
    ;
    if (req.method == 'DELETE') {
        res.writeHead(200, {'Content-Type': 'test/plain'});
        res.write('Job cancelled');
        res.end();
    }
});



