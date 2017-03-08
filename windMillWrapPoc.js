const hdb = require('hdb');
const hdbconfig = require('./hdbconfig/config');

var client = hdb.createClient(hdbconfig.hdbconfig);

var hdbObj = {
    client: client,
    value: {},
    parameters: [],
    results: []
};

client.on('error', function (err) {
    hdbObj.error = err;
});

var start, end;

Date.prototype.format = function (format) {
    var output = '';
    if (format == 'YYYY-MM-DD') {
        output = this.getFullYear();
        if (String(this.getMonth() + 1).length == 1) {
            output += '-0' + String(this.getMonth() + 1);
        } else {
            output += '-' + String(this.getMonth() + 1);
        }
        if (String(this.getDate()).length == 1) {
            output += '-0' + this.getDate();
        } else {
            output += '-' + this.getDate();
        }
        return output;
    }
};

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

function hdbSelect(obj) {
    return new Promise(function (resolve, reject) {
        obj.client.prepare(hdbconfig.hdbsql.select, function (err, statement) {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                statement.exec([new Date('2013-03-05').format('YYYY-MM-DD')], function (err, rows) {
                    if (err) {
                        obj.client.end();
                        reject(err);
                    } else {
                        obj.value = rows;
                        resolve(obj);
                    }
                })
            }
        })
    })
};

function handleRows(obj) {
    return new Promise(function (resolve, reject) {
        var arr = [];
        for (var i = 0; i < obj.value.length; i++) {
            for (var key in obj.value[i]) {
                var valSplit = obj.value[i][key].split('-');
                if (valSplit.length == 3) {
                    arr.push(valSplit[0] + '-' + valSplit[1] + '-' + valSplit[2]);
                }
            }
        }
        if (arr) {
            obj.value = arr;
            resolve(obj);
        } else {
            reject('No value found');
        }
    })
};

function callProcedure(obj) {
    return new Promise(function (resolve, reject) {
        obj.client.prepare(hdbconfig.hdbsql.procedure, function (err, statement) {
            if (err) {
                obj.client.end();
                reject(err);
            } else {
                for (var i = 0; i < obj.value.length; i++) {
                    statement.exec({
                        EXTID: obj.value[i]
                    }, function (err, parameters, result) {
                        if (err) {
                            obj.client.end();
                            reject(err);
                        } else {
                            obj.parameters = parameters;
                            obj.results = result;
                            if (i == obj.value.length) {
                                obj.client.end();
                                resolve(obj);
                            }
                        }
                    })
                }
            }
        })
    })
};

function returnVal(obj) {
    return new Promise(function (resolve, reject) {
        var res = {};
        var count = 0;
        obj.results.forEach(function (val) {
            count += 1;
            res['row' + count] = val;
        });
        resolve(res);
    })
}

function excHandler(err) {
    console.error(err);
};

module.exports.wrapWindMill = hdbconnect(hdbObj)
    .then(hdbSelect)
    .then(handleRows)
    .catch(excHandler)
    .then(callProcedure)
    .catch(excHandler)
    .then(returnVal);


