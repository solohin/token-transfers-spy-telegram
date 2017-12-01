"use strict";
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

describe('/start message', () => {
    beforeEach(() => {
        sendTelegramMessage.mockClear();
        db.__reset();
    });

    describe('Admin', () => {
        it('should send specific message for admin', () => {
            onMessage(ADMIN_CHAT_ID, '/start');
            assert.strictEqual(1, sendTelegramMessage.mock.calls.length);
            assert.strictEqual(ADMIN_CHAT_ID, sendTelegramMessage.mock.calls[0][0]);
            assert(sendTelegramMessage.mock.calls[0][1].indexOf('админ') !== -1);
        });
        it('should add to subscription list', () => {
            onMessage(ADMIN_CHAT_ID, '/start');
            const calls = db.__getCalls('set');
            assert.strictEqual(1, calls.length);
            assert.strictEqual('/listeners/' + ADMIN_CHAT_ID, calls[0][0]);
            assert(!!calls[0][1]);
        });
    });

    describe('User', () => {
        it('should send specific message for non-admin', () => {
            onMessage(CHAT_ID, '/start');
            assert.strictEqual(1, sendTelegramMessage.mock.calls.length);
            assert.strictEqual(CHAT_ID, sendTelegramMessage.mock.calls[0][0]);
            assert(sendTelegramMessage.mock.calls[0][1].indexOf('админ') === -1);
        });
        it('should add to subscription list', () => {
            onMessage(CHAT_ID, '/start');
            const calls = db.__getCalls('set');
            assert.strictEqual(1, calls.length);
            assert.strictEqual('/listeners/' + CHAT_ID, calls[0][0]);
            assert(!!calls[0][1]);
        });
    });
});