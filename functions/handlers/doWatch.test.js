"use strict";
jest.mock('../components/getLastTransaction.js');
jest.mock('../components/db.js');
//libs
//modules
const doWatch = require('./doWatch');
const getLastTransaction = require('../components/getLastTransaction');
const db = require('../components/db');
//init

describe('First load', () => {
    beforeAll(done => {
        db.__reset();
        db.__mock('get', (path) => {
            let data = null;
            if(path === '/watch'){
                data = {
                    '0xaddress1': {
                        address: '0xaddress1',
                        decimals: 12,
                        minAmount: 1000000,
                        name: 'Address One'
                    }
                }
            }
            return Promise.resolve(data);
        });
        getLastTransaction.mockClear();
        getLastTransaction.setData({
            '0xaddress1': ({transactionHash: '0xadd1lastTx', blockNumber: 777})
        });
        doWatch().then(() => done);
    });
    it('should call getLastTransaction and save its result', () => {
        doWatch().then(() => {

        });
    });
});
describe('Normal', () => {
    it('should properly call getNewTransactions');
    it('should save last block and hash in the database');
    it('should calculate proper amount using decimals');
    it('should report about each operation of each tag');
});