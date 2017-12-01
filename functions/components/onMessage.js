"use strict";
//libs
//modules
const onUnkownMessage = require('../handlers/onUnkownMessage');
const onStartMessage = require('../handlers/onStartMessage');
//init
module.exports = function (chatId, text) {
    const command = text.split(' ')[0];
    if(command === '/start'){
        return onStartMessage(chatId);
    }
    return onUnkownMessage(chatId);
};