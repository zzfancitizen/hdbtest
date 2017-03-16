const hdb = require('hdb');
const hdbconfig = require('./hdbconfig/config');

var client = hdb.createClient(hdbconfig.hdbconfig);

var hdbObj = {
    client: client,
    value: {},
    parameters: [],
    results: [],
    error: ''
};

client.on('error', function (err) {
    hdbObj.error = err;
});

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

function hdbconnect(obj) {
    return new Promise(function (resolve, reject) {
        obj.client.connet(function (err) {
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

    })
};