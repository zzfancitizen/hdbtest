const hdb = require('hdb');
const hdbconfig = require('./hdbconfig/config');
const fs = require('fs');

Date.prototype.format = function (format) {
    var output = '';
    if (format == 'YYYY-MM-DD HH24:MI:SS') {
        output = this.getFullYear();
        if (String(this.getMonth() + 1).length == 1) {
            output += '-0' + String(this.getMonth() + 1);
        } else {
            output += '-' + String(this.getMonth() + 1);
        }
        ;
        if (String(this.getDate()).length == 1) {
            output += '-0' + this.getDate();
        } else {
            output += '-' + this.getDate();
        }
        ;
        if (String(this.getHours()).length == 1) {
            output += ' 0' + this.getHours();
        } else {
            output += ' ' + this.getHours();
        }
        ;
        if (String(this.getMinutes()).length == 1) {
            output += ':0' + this.getMinutes();
        } else {
            output += ':' + this.getMinutes();
        }
        ;
        if (String(this.getSeconds()).length == 1) {
            output += ':0' + this.getSeconds();
        } else {
            output += ':' + this.getSeconds();
        }
        ;
        return output;
    } else if (format == 'YYYY-MM-DD') {
        output = this.getFullYear();
        if (String(this.getMonth() + 1).length == 1) {
            output += '-0' + String(this.getMonth() + 1);
        } else {
            output += '-' + String(this.getMonth() + 1);
        }
        ;
        if (String(this.getDate()).length == 1) {
            output += '-0' + this.getDate();
        } else {
            output += '-' + this.getDate();
        }
        ;
        return output;
    }
};

function hdbClient() {

    this.hdbObj = {
        client: hdb.createClient(hdbconfig.hdbconfig),
        parameters: {
            time: '',
            freq: 0
        },
        error: ''
    };

    var that = this;

    this.setParams = function (time, freq) {
        that.hdbObj.parameters.time = time;
        that.hdbObj.parameters.freq = freq;
    }

    this.hdbconnect = function () {
        that.hdbObj.client.connect(function (err) {
            if (err) {
                var logErr = new Date().toString() + ' ' + err;
                fs.appendFile(hdbconfig.log.equi, logErr, function (err) {
                    if (err) console.error(err);
                })
                // throw new _UserException("HDB connection error !");
            }
        });
    };

    this.hdbTrans = function () {
        that.hdbObj.client.prepare(hdbconfig.hdbsql.equiWraper, function (err, statement) {
            if (err) {
                that.hdbObj.client.end();
                var logErr = new Date().toString() + ' ' + err;
                fs.appendFile(hdbconfig.log.equi, logErr, function (err) {
                    if (err) console.error(err);
                })
                // throw new _UserException("HDB statement prepared error !");
            } else {
                statement.exec(
                    {
                        DATE: new Date().format('YYYY-MM-DD')
                    },
                    function (err) {
                        if (err) {
                            that.hdbObj.client.end();
                            var logErr = new Date().toString() + ' ' + err;
                            fs.appendFile(hdbconfig.log.equi, logErr, function (err) {
                                if (err) console.error(err);
                            })
                            // throw new _UserException("HDB statement prepared error !");
                            // throw new _UserException("HDB statement run error !");
                        }
                    }
                )
            }
        });
    };

    this.hdbClose = function () {
        that.hdbObj.client.end();
    }

    function _UserException(message) {
        this.message = message;
        this.name = 'UserException';
    }
};

module.exports.myHDB = new hdbClient();
