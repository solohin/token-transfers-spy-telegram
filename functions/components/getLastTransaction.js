"use strict";
//libs
const request = require('request-promise');
//modules
//init
module.exports = function (address) {
    let hash;
    return request({uri: `https://api.ethplorer.io/getTokenHistory/${address}?apiKey=freekey&limit=1`}).then(({body}) => {
        if (!body.operations[0]) {
            return Promise.resolve(null);
        }
        hash = body.operations[0].transactionHash;
        return request({uri: `https://api.ethplorer.io/getTxInfo/${hash}?apiKey=freekey`})
    }).then((response) => {
        if (!response) {
            return null;
        }

        return {
            transactionHash: hash,
            blockNumber: response.body.blockNumber,
        };
    });
};