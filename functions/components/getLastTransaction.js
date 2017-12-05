"use strict";
//libs
const request = require('request-promise');
//modules
//init
module.exports = function (address) {
    let hash;
    const uri = `https://api.ethplorer.io/getTokenHistory/${address}?apiKey=freekey&limit=1`;
    return request({uri, json: true}).then(body => {
        if (!body || !body.operations[0]) {
            console.error('ethplorer API resonse ' + uri, response);
            return Promise.resolve(null);
        }
        hash = body.operations[0].transactionHash;
        return request({uri: `https://api.ethplorer.io/getTxInfo/${hash}?apiKey=freekey`, json: true})
    }).then(body => {
        if (!body) return null;
        return {
            transactionHash: hash,
            blockNumber: body.blockNumber,
        };
    });
};