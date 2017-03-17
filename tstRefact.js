const hdb = require('hdb');
const hdbconfig = require('./hdbconfig/config');

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
                throw new _UserException("HDB connection error !");
            }
        });
    };

    this.hdbTrans = function () {
        that.hdbObj.client.prepare(hdbconfig.hdbsql.dummyWraper, function (err, statement) {
            if (err) {
                that.hdbObj.client.end();
                throw new _UserException("HDB statement prepared error !");
            } else {
                statement.exec(
                    {
                        TIMESTAMP: new Date().format('YYYY-MM-DD HH24:MI:SS'),
                        DESC: 'Andy Testing!',
                        FREQ: that.hdbObj.parameters.freq
                    },
                    function (err) {
                        if (err) {
                            that.hdbObj.client.end();
                            throw new _UserException("HDB statement run error !");
                        }
                        that.hdbObj.client.end();
                    }
                )
            }
        });
    };

    function _UserException(message) {
        this.message = message;
        this.name = 'UserException';
    }
};

module.exports.myHDB = new hdbClient();


