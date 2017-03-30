const http = require('http');
const cron = require('cron');
const hdb = require('./scadaWrapper').myHDB;
const async = require('async');

var server = http.createServer().listen(process.env.PORT || 8080);
var CronJob = cron.CronJob;
var scheduelWrap = {};
var isRunning = false;

server.on('request', function (req, res) {
    if (req.url == '/scada') {
        if (req.method == 'GET') {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(__dirname);
            res.end();
        }
        if (req.method == 'PUT') {
            req.on('data', function (chunk) {
                var time = JSON.parse(chunk.toString()).time.split(':');
                var rule = '*/%4 %2 %3 * * *'.replace(/%1/g, time[2])
                    .replace(/%2/g, time[1])
                    .replace(/%3/g, time[0])
                    .replace(/%4/g, JSON.parse(chunk.toString()).freq);
                time = [];
                if (!isRunning) {
                    hdb.hdbconnect();
                    scheduleWrap = new CronJob(rule, function () {
                        hdb.setParams(JSON.parse(chunk.toString()).time, JSON.parse(chunk.toString()).freq);
                        hdb.hdbTrans();
                        console.log('Job run');
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
                hdb.hdbClose();
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