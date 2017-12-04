"use strict";
//libs
const abiDecoder = require('../components/abiDecoder');
const request = require('request-promise');
//modules
const testABI = require('./defaultABI');
const config = require('../config');
//init
abiDecoder.addABI(testABI);

module.exports = function ({fromBlock, address, lastTxHash}) {
    return request({
        uri: `http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${fromBlock}&endblock=99999999&sort=desc&apikey=${config.etherscanAPIKey}`,
    }).then(({body}) => {
        const transactions = body.result;
        const result = [];
        for (let transaction of transactions) {
            if (transaction.hash === lastTxHash) break;

            const decoded = abiDecoder.decodeMethod(transaction.input);

            if (decoded.name !== 'transfer' || !decoded.params) continue;
            const toParameter = (decoded.params.filter(param => param.name === '_to')[0] || {}).value;
            const amountParameter = (decoded.params.filter(param => param.name === '_value')[0] || {}).value;

            result.push({
                blockNumber: parseInt(transaction.blockNumber),
                to: toParameter,
                from: transaction.from,
                hash: transaction.hash,
                amount: amountParameter,
            });
        }
        return result;
    });
};