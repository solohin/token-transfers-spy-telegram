"use strict";
jest.mock('request-promise');
//libs
const assert = require('chai').assert;
const request = require('request-promise');
//modules
const getLastTransaction = require('./getLastTransaction');
//init

describe('Get last transaction', () => {
    let result;
    beforeAll(done => {
        request.mockClear();

        request.setURLs({
            'https://api.ethplorer.io/getTokenHistory/0xTestAddress?apiKey=freekey&limit=1': {
                operations: [
                    {transactionHash: '0xNewTx'},
                ]
            },
            'https://api.ethplorer.io/getTxInfo/0xNewTx?apiKey=freekey': {
                blockNumber: 7777
            }
        });

        getLastTransaction('0xTestAddress').then(data => {
            result = data;
            done();
        }).catch(e => {
            console.error(e);
            done();
        })
    });
    it('should call API and return last transaction stats', () => {
        assert.strictEqual('0xNewTx', result.transactionHash);
        assert.strictEqual(7777, result.blockNumber);
    });
})
;


describe('Empty data', () => {
    let result;
    beforeAll(done => {
        request.mockClear();

        request.setURLs({
            'https://api.ethplorer.io/getTokenHistory/0xTestAddress?apiKey=freekey&limit=1': {
                operations: []
            }
        });

        getLastTransaction('0xTestAddress').then(data => {
            result = data;
            done();
        });
    });
    it('should return null', () => {
        assert.strictEqual(null, result);
    });
})
;