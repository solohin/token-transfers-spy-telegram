"use strict";
jest.mock('request-promise');
//libs
const assert = require('chai').assert;
const request = require('request-promise');
const config = require('../config');
//modules
const getNewTransactions = require('./getNewTransactions');
//init

describe('Get new transactions', () => {
    let result;
    beforeAll(done => {
        request.mockClear();

        const urls = {};
        urls['http://api.etherscan.io/api?module=account&action=txlist&address=0xTokenAddress&startblock=7777&endblock=99999999&sort=desc&apikey=' + config.etherscanAPIKey] = {
            result: [
                {
                    blockNumber: "9000",
                    input: "0xa9059cbb0000000000000000000000007af1fd9ac06c3776a29c3dfc5668c9a1169c8bfc000000000000000000000000000000000000000000000000cbcb99b20e9c8000",
                    hash: "0xtxHash1",
                    from: '0xfrom1'
                },
                {
                    blockNumber: "7777",
                    input: "0xa9059cbb0000000000000000000000007f6d0233ba26d199845a93337017fa35501eebf200000000000000000000000000000000000000000000010f0cf064dd59200000",
                    hash: "0xtxHash2",
                    from: '0xfrom2'
                },
                {
                    blockNumber: "7777",
                    input: "0xa9059cbb00000000000000000000000083a77a3798ef6a264af23d4d4c0ee51b4de16bb900000000000000000000000000000000000000000000000ad78ebc5ac6200000",
                    hash: "0xOldTxHash",
                    from: '0xnobodycares'
                },
                {
                    blockNumber: "7777",
                    input: "0xa9059cbb000000000000000000000000eee28d484628d41a82d01e21d12e2e78d69920da00000000000000000000000000000000000000000000002214f7170130160000",
                    hash: "0xveryOldTxHash",
                    from: '0xnobodycares'
                },
            ]
        };
        request.setURLs(urls);

        getNewTransactions({fromBlock: 7777, address: '0xTokenAddress', lastTxHash: '0xOldTxHash'}).then(data => {
            result = data;
            done();
        }).catch(e => {
            console.error(e);
            done();
        });
    });

    it('should return 2 new transactions', () => {
        assert.strictEqual(2, result.length);

        assert.strictEqual(9000, result[0].blockNumber);
        assert.strictEqual("0xtxHash1", result[0].hash);
        assert.strictEqual("0xfrom1", result[0].from);
        assert.strictEqual("0x7af1fd9ac06c3776a29c3dfc5668c9a1169c8bfc", result[0].to);
        assert.strictEqual("14685000000000000000", result[0].amount);

        assert.strictEqual(7777, result[1].blockNumber);
        assert.strictEqual("0xtxHash2", result[1].hash);
        assert.strictEqual("0xfrom2", result[1].from);
        assert.strictEqual("0x7f6d0233ba26d199845a93337017fa35501eebf2", result[1].to);
        assert.strictEqual("5000000000000000000000", result[1].amount);
    });
})
;