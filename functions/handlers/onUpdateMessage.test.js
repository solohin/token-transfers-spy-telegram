"use strict";
jest.mock('../components/getSpreadsheetData.js');
jest.mock('../components/sendTelegramMessage.js');
jest.mock('../components/isAdmin.js');
jest.mock('../components/db.js');
//libs
const assert = require('chai').assert;
//modules
const onMessage = require('../components/onMessage');
const db = require('../components/db');
const sendTelegramMessage = require('../components/sendTelegramMessage.js');
//init

const CHAT_ID = 12333;
const ADMIN_CHAT_ID = 777;

describe('Update message', () => {
    beforeEach(() => {

    });

    describe('Admin', () => {
        beforeAll(done => {
            db.__reset();
            db.__mock('get', (path) => {
                if (path !== '/watch') throw `Did not mock "${path}" path`;
                return Promise.resolve({
                    '0x00c7122633a4ef0bc72f7d02456ee2b11e97561e': {address: '0x00c7122633a4ef0bc72f7d02456ee2b11e97561e'},
                    '0xtoDelete1': {address: '0xtoDelete1'},
                    '0xtoDelete2': {address: '0xtoDelete2'},
                });
            });
            sendTelegramMessage.mockClear();
            onMessage(ADMIN_CHAT_ID, '/update').then(() => done());
        });
        it('should update tokens list with valid lines', () => {
            const calls = db.__getCalls('update');
            assert.strictEqual(3, calls.length);

            assert.strictEqual('/watch/0x00c7122633a4ef0bc72f7d02456ee2b11e97561e', calls[0][0]);
            assert.strictEqual('0x00c7122633a4ef0bc72f7d02456ee2b11e97561e', calls[0][1].address);
            assert.strictEqual('RDN 50m', calls[0][1].name);
            assert.strictEqual(50000000, calls[0][1].minAmount);

            assert.strictEqual('/watch/0x519475b31653e46d20cd09f9fdcf3b12bdacb4f5', calls[1][0]);
            assert.strictEqual('0x519475b31653e46d20cd09f9fdcf3b12bdacb4f5', calls[1][1].address);
            assert.strictEqual('VIU ten', calls[1][1].name);
            assert.strictEqual(10, calls[1][1].minAmount);

            assert.strictEqual('/watch/0xab95e915c123fded5bdfb6325e35ef5515f1ea69', calls[2][0]);
            assert.strictEqual('0xab95e915c123fded5bdfb6325e35ef5515f1ea69', calls[2][1].address);
            assert.strictEqual('XENON 1.12m', calls[2][1].name);
            assert.strictEqual(1120000, calls[2][1].minAmount);
        });
        it('should delete old tokens', () => {
            const calls = db.__getCalls('set');
            assert.strictEqual(2, calls.length);

            assert.strictEqual('/watch/0xtoDelete1', calls[0][0]);
            assert.strictEqual(null, calls[0][1]);

            assert.strictEqual('/watch/0xtoDelete2', calls[1][0]);
            assert.strictEqual(null, calls[1][1]);
        });
        it('should send message with all tokens list and count', () => {
            const calls = sendTelegramMessage.mock.calls;
            assert.strictEqual(1, calls.length);
            assert(calls[0][1].indexOf('RDN 50m') !== -1);
            assert(calls[0][1].indexOf('VIU ten') !== -1);
            assert(calls[0][1].indexOf('XENON 1.12m') !== -1);
            assert(calls[0][1].indexOf('3') !== -1);
        });
    });

    describe('User', () => {
        beforeAll(done => {
            db.__reset();
            sendTelegramMessage.mockClear();
            onMessage(CHAT_ID, '/update').then(() => done());
        });
        it('should do nothing',()=>{
            assert.strictEqual(0,db.__getCalls('set').length);
            assert.strictEqual(0,db.__getCalls('get').length);
            assert.strictEqual(0,db.__getCalls('update').length);
        });
    })
});