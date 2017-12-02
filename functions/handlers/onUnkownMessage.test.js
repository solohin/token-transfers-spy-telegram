"use strict";
jest.mock('../components/sendTelegramMessage.js');
jest.mock('../components/isAdmin.js');
jest.mock('../components/db.js');
//libs
const assert = require('chai').assert;
//modules
const onMessage = require('../components/onMessage');
const sendTelegramMessage = require('../components/sendTelegramMessage.js');
//init

const CHAT_ID = 12333;

describe('Unjnown message', () => {
    beforeEach(() => {
        sendTelegramMessage.mockClear();
    });

    it('should send any message', done => {
        onMessage(CHAT_ID, 'abracadabra').then(()=>{
            assert.strictEqual(1, sendTelegramMessage.mock.calls.length);
            done();
        })
    });
});