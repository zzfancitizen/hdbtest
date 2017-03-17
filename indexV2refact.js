const http = require('http');
const cron = require('cron');
const hdb = require('./tstRefact').myHDB;

var server = http.createServer().listen(process.env.PORT || 8080);
var CronJob = cron.CronJob;
var scheduelWrap = {};
var isRunning = false;

server.on('request', function (req, res) {
    if (req.url == '/scada') {
        if (req.method == 'PUT') {
            req.on('data', function (chunk) {
                var time = JSON.parse(chunk.toString()).time.split(':');
                var rule = '*/%4 %2 %3 * * *'.replace(/%1/g, time[2])
                    .replace(/%2/g, time[1])
                    .replace(/%3/g, time[0])
                    .replace(/%4/g, JSON.parse(chunk.toString()).freq);
                time = [];
                if (!isRunning) {
                    scheduleWrap = new CronJob(rule, function () {
                        try {
                            hdb.setParams(JSON.parse(chunk.toString()).time, JSON.parse(chunk.toString()).freq);
                            hdb.hdbconnect();
                            hdb.hdbTrans();
                            console.log('Job run');
                        } catch (e) {
                            res.writeHead(500, {'Content-Type': 'text/plain'});
                            res.write(e);
                            res.end();
                        }
                    }, null, false, null);
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
});
