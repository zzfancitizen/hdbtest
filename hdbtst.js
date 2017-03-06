const hdb = require('hdb');
const hdbconfig = require('./hdbconfig/config');

var client = hdb.createClient(hdbconfig.hdbconfig);
var hdbObj = {
    client: client,
    value: ''
}

client.on('error', function (err) {
    console.error('Network connection error', err);
});

function hdbconnect(obj) {
    return new Promise(function (resolve, reject) {
        obj.client.connect(function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(obj);
            }
        })
    })
};

function hdbexecute(obj) {
    return new Promise(function (resolve, reject) {
        obj.client.exec(hdbconfig.hdbsql.select, function (err, rows) {
            if (err) {
                reject(err);
            } else {
                // obj.client.end();
                obj.value = rows;
                resolve(obj);
            }
        })
    })
};

function hdbexcept(err) {
    return new Promise(function (resolve, reject) {
        console.error(err);
    })
};

function hdbDataHandler(obj) {
    return new Promise(function (resolve, reject) {
        try {
            var arr = [];
            for (var i = 0; i < obj.value.length; i++) {
                var strSplit = obj.value[i].TPLNR.split('-');
                if (typeof strSplit[2] == "undefined") continue;
                var str = strSplit[0] + '-' + strSplit[1] + '-' + strSplit[2];
                arr.push(str);
            }
            obj.value = _uniq(arr);
            resolve(obj);
        }
        catch (err) {
            reject(err);
        }
        ;

        function _uniq(a) {
            var oriVal = '';
            var resultArr = [];
            a.sort().forEach(function (val) {
                if (oriVal == val) {
                    return;
                } else {
                    oriVal = val;
                    resultArr.push(val);
                }
            });
            return resultArr;
        }
    })
};

function printResult(obj) {
    return new Promise(function (resolve, reject) {
        console.log(obj.value);
        resolve(obj)
    })
}

function insertHdb(obj) {
    return new Promise(function (resolve, reject) {
        obj.client.prepare(hdbconfig.hdbsql.procedure, function (err, statement) {
            if (err) reject(err);
            statement.exec(hdbconfig.hdbsql.inputPara, function (err, parameters, dummyRows) {
                if (err) reject(err);
                console.log('Parameters:', parameters);
                console.log('Dummies:', dummyRows);
            })
        });
        obj.client.end();
    })
}

Promise.resolve(hdbObj)
    .then(hdbconnect)
    .then(hdbexecute)
    .catch(hdbexcept)
    .then(hdbDataHandler)
    .catch(hdbexcept)
    .then(printResult)
    .then(insertHdb)
    .catch(hdbexcept);