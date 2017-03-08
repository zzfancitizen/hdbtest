const wrap = require('./windMillWrapPoc').wrapWindMill;
const http = require('http');
const schedule = require('node-schedule');
const cron = require('cron');

var server = http.createServer().listen(8080);
var CronJob = cron.CronJob;
var scheduleWrap = {};

function startJob() {
    console.log('You will see this message every second');
};

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
    if (req.method == 'PUT') {
        req.on('data', function (chunk) {
            var pars = JSON.parse(chunk.toString());
            var rule = '*/%d * * * * *'.replace(/%d/g, pars.value);
            scheduleWrap = new CronJob(rule, startJob, null, false, null);
            scheduleWrap.start();
            res.writeHead(200, {'Content-Type': 'test/plain'});
            res.write('Job scheduled');
            res.end();
        })
    }
    ;
    if (req.method == 'DELETE') {
        try {
            scheduleWrap.stop();
            res.writeHead(200, {'Content-Type': 'test/plain'});
            res.write('Job cancelled');
            res.end();
        } catch (err) {
            res.writeHead(500, {'Content-Type': 'test/plain'});
            res.write('Please schedule one job first.');
            res.end();
        }
    }
    ;
});



