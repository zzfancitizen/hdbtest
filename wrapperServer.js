const http = require('http');
const cron = require('cron');
const hdbScada = require('./scadaWrapper').myHDB;
const hdbEqui = require('./equiWrapper').myHDB;
const async = require('async');

var server = http.createServer().listen(process.env.PORT || 8080);
var CronJob = cron.CronJob;
var scheduleScada = {};
var scheduleEqui = {};
var isRunningScada = false;
var isRunningEqui = false;

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
                if (!isRunningScada) {
                    hdbScada.hdbconnect();
                    scheduleScada = new CronJob(rule, function () {
                        hdbScada.setParams(JSON.parse(chunk.toString()).time, JSON.parse(chunk.toString()).freq);
                        hdbScada.hdbTrans();
                        console.log('Job run');
                    }, null, false, null);
                    scheduleScada.start();
                    isRunningScada = true;
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
                hdbScada.hdbClose();
                scheduleScada.stop();
                isRunningScada = false;
                scheduleScada = {};
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
    } else if (req.url == '/equi') {
        if (req.method == 'GET') {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(__dirname);
            res.end();
        }
        if (req.method == 'PUT') {
            req.on('data', function (chunk) {
                if (!isRunningEqui) {
                    hdbEqui.hdbconnect();
                    scheduleEqui = new CronJob('0 0 0 * * *', function () {
                        hdbEqui.hdbTrans();
                        console.log('Job run');
                    }, null, false, null);
                    scheduleEqui.start();
                    isRunningEqui = true;
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
                hdbEqui.hdbClose();
                scheduleEqui.stop();
                isRunningEqui = false;
                scheduleEqui = {};
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
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Not found');
        res.end();
    }
    ;
});