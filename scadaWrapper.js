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
}