"use strict";
//libs
//modules
const onUnkownMessage = require('../handlers/onUnkownMessage');
const onStartMessage = require('../handlers/onStartMessage');
const onUpdateMessage = require('../handlers/onUpdateMessage');
const isAdmin = require('../components/isAdmin');
//init
module.exports = function (chatId, text) {
    const command = text.split(' ')[0];
    if(command === '/start'){
        return onStartMessage(chatId);
    }
    if(command === '/update' && isAdmin(chatId)){
        return onUpdateMessage(chatId);
    }
    return onUnkownMessage(chatId);
};