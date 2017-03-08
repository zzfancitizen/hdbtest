const wrap = require('./windMillWrapPoc').wrapWindMill;
const http = require('http');
const cron = require('cron');

var server = http.createServer().listen(8080);
var CronJob = cron.CronJob;
var scheduleWrap = {};
var isRunning = false;

function startJob() {
    console.log('You will see this message every second');
};

server.on('request', function (req, res) {
    if (req.url == '/jobschedule') {
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
                var time = JSON.parse(chunk.toString()).time.split(':');
                var rule = '%1 %2 %3 * * */1'.replace(/%1/g, time[2])
                    .replace(/%2/g, time[1])
                    .replace(/%3/g, time[0]);
                if (!isRunning) {
                    scheduleWrap = new CronJob(rule, startJob, null, false, null);
                    scheduleWrap.start();
                    isRunning = true;
                    res.writeHead(200, {'Content-Type': 'test/plain'});
                    res.write('Job scheduled');
                    res.end();
                } else {
                    res.writeHead(200, {'Content-Type': 'test/plain'});
                    res.write('Job already scheduled');
                    res.end();
                }
                ;

            })
        }
        ;
        if (req.method == 'DELETE') {
            try {
                scheduleWrap.stop();
                isRunning = false;
                scheduleWrap = {};
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
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Not found');
        res.end();
    }
    ;
});



