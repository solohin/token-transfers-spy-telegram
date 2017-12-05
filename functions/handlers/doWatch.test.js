"use strict";
jest.mock('../components/getLastTransaction.js');
jest.mock('../components/getNewTransactions.js');
jest.mock('../components/sendTelegramMessage.js');
jest.mock('../components/db.js');
//libs
const assert = require('chai').assert;
//modules
const doWatch = require('./doWatch');
const getLastTransaction = require('../components/getLastTransaction');
const getNewTransactions = require('../components/getNewTransactions');
const sendTelegramMessage = require('../components/sendTelegramMessage');
const db = require('../components/db');
//init

describe('First load', () => {
    beforeAll(done => {
        db.__reset();
        db.__mock('get', (path) => {
            let data = null;
            if (path === '/watch') {
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
        getNewTransactions.mockClear();
        getLastTransaction.mockClear();
        getLastTransaction.setData({
            '0xaddress1': ({transactionHash: '0xadd1lastTx', blockNumber: 777})
        });
        doWatch().then(() => done());
    });
    it('should call getLastTransaction and save its result', () => {
        const calls = db.__getCalls('update');
        assert.strictEqual(1, calls.length);

        assert.strictEqual('/watch/0xaddress1', calls[0][0]);
        assert.strictEqual('0xadd1lastTx', calls[0][1].lastTxHash);
        assert.strictEqual(777, calls[0][1].lastBlock);

        assert.strictEqual(0, getNewTransactions.mock.calls.length);
    });
});
describe('Normal', () => {
    beforeAll(done => {
        db.__reset();
        db.__mock('get', (path) => {
            let data = null;
            if (path === '/watch') {
                data = {
                    '0xaddress1': {
                        address: '0xaddress1',
                        decimals: 4,
                        minAmount: 50,
                        name: 'Address One',
                        lastTxHash: '0xFirstOldTx',
                        lastBlock: 1111,
                    },
                    '0xaddress2': {
                        address: '0xaddress2',
                        decimals: 18,
                        minAmount: 3000,
                        name: 'Address Two',
                        lastTxHash: '0xSecondOldTx',
                        lastBlock: 2222,
                    },
                }
            }
            return Promise.resolve(data);
        });
        getLastTransaction.mockClear();
        sendTelegramMessage.mockClear();
        getNewTransactions.mockClear();
        getNewTransactions.clearData();

        //1 new 49 tokens, 1 new 50 tokens, 1
        getNewTransactions.addData(
            {
                lastBlock: 1111,
                address: '0xaddress1',
                lastTxHash: '0xFirstOldTx'
            },
            [
                {
                    blockNumber: 1115,
                    to: '0xnewTX1Receiver',
                    from: '0xnewTX1Sender',
                    hash: '0xnewTX1',
                    amount: 490000,
                },
                {
                    blockNumber: 1114,
                    to: '0xnewTX2Receiver',
                    from: '0xnewTX2Sender',
                    hash: '0xnewTX2',
                    amount: 510000,
                },
                {
                    blockNumber: 1111,
                    to: '0xoldTXReceiver',
                    from: '0xoldTXSender',
                    hash: '0xFirstOldTx',
                    amount: 510000,
                },
                {
                    blockNumber: 1111,
                    to: '0xoldTXReceiver',
                    from: '0xoldTXSender',
                    hash: '0xSecondOldTx',
                    amount: 510000,
                },
            ]
        );

        //empty for 2nd token
        getNewTransactions.addData({
            lastBlock: 2222,
            address: '0xaddress2',
            lastTxHash: '0xSecondOldTx'
        }, []);

        doWatch().then(() => done()).catch(e => {
            console.error(e);
            done();
        })
    });
    it('should not call getLastTransaction', () => {
        assert.strictEqual(0, getLastTransaction.mock.calls.length);
    });
    it('should send 1 message', () => {
        assert.strictEqual(1, sendTelegramMessage.mock.calls.length);
    });
    it('should send a Telegram message to everybody', () => {
        const [[chatId,]] = sendTelegramMessage.mock.calls;
        assert.isNull(chatId);
    });
    it('should use token name in the message', () => {
        const [[, text]] = sendTelegramMessage.mock.calls;
        assert.include(text, 'Address One');
    });
    it('should use both addresses and TX address in the message', () => {
        const [[, text]] = sendTelegramMessage.mock.calls;
        assert.include(text, '0xnewTX2Receiver');
        assert.include(text, '0xnewTX2Sender');
        assert.include(text, '0xnewTX2');
    });
    it('should save last block and hash in the database', () => {
        const calls = db.__getCalls('update');
        const [path, data] = calls[0];
        assert.strictEqual('/watch/0xaddress1', path);
        assert.strictEqual('0xnewTX1', data.lastTxHash);
        assert.strictEqual(1115, data.lastBlock);
    });
    it('should calculate proper amount using decimals', () => {
        const [[, text]] = sendTelegramMessage.mock.calls;
        assert.include(text, '51');
        assert.notInclude(text, '510');
    });
});