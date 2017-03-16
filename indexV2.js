const http = require('http');
const cron = require('cron');
const hdb = require('hdb');
const hdbconfig = require('./hdbconfig/config');

var hdbObj = {
    client: hdb.createClient(hdbconfig.hdbconfig),
    parameters: {
        time: '',
        freq: 0
    },
    error: ''
};

Date.prototype.format = function (format) {
    var output = '';
    if (format == 'YYYY-MM-DD HH24:MI:SS') {
        output = this.getFullYear();
        if (String(this.getMonth() + 1).length == 1) {
            output += '-0' + String(this.getMonth() + 1);
        } else {
            output += '-' + String(this.getMonth() + 1);
        };
        if (String(this.getDate()).length == 1) {
            output += '-0' + this.getDate();
        } else {
            output += '-' + this.getDate();
        };
        if (String(this.getHours()).length == 1) {
            output += ' 0' + this.getHours();
        } else {
            output += ' ' + this.getHours();
        };
        if (String(this.getMinutes()).length == 1) {
            output += ':0' + this.getMinutes();
        } else {
            output += ':' + this.getMinutes();
        };
        if (String(this.getSeconds()).length == 1) {
            output += ':0' + this.getSeconds();
        } else {
            output += ':' + this.getSeconds();
        };
        return output;
    }
};

var server = http.createServer().listen(process.env.PORT || 8080);
var CronJob = cron.CronJob;
var scheduelWrap = {};
var isRunning = false;

function hdbconnect(obj) {
    return new Promise(function (resolve, reject) {
        obj.client.connect(function (err) {
            if (err) {
                obj.client.end();
                reject(err);
            } else {
                resolve(obj);
            }
        })
    })
};

function hdbTrans(obj) {
    return new Promise(function (resolve, reject) {
        obj.client.prepare(hdbconfig.hdbsql.dummyWraper, function (err, statement) {
            if (err) {
                obj.client.end();
                reject(err);
            } else {
                statement.exec({
                    TIMESTAMP: new Date().format('YYYY-MM-DD HH24:MI:SS'),
                    DESC: 'Andy Testing!',
                    FREQ: obj.parameters.freq
                }, function (err) {
                    if (err) {
                        obj.client.end();
                        reject(err);
                    } else {
                        obj.client.end();
                        resolve(obj);
                    }
                })
            }
        })
    })
};

function catchError(err) {
    console.log(err);
}

server.on('request', function (req, res) {
    if (req.url == '/scada') {
        if (req.method == 'PUT') {
            req.on('data', function (chunk) {
                hdbObj.parameters.time = JSON.parse(chunk.toString()).time;
                hdbObj.parameters.freq = JSON.parse(chunk.toString()).freq;
                var time = JSON.parse(chunk.toString()).time.split(':');
                var rule = '*/%4 %2 %3 * * *'.replace(/%1/g, time[2])
                                              .replace(/%2/g, time[1])
                                              .replace(/%3/g, time[0])
                                              .replace(/%4/g, hdbObj.parameters.freq.toString());
                time = [];
                if (!isRunning) {
                    scheduleWrap = new CronJob(rule, function () {
                        hdbconnect(hdbObj).then(hdbTrans).catch(catchError);
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