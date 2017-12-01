"use strict";
//libs
//modules
const sendTelegramMessage = require('../components/sendTelegramMessage');
//init
module.exports = function (chatId) {
    return sendTelegramMessage(chatId, `Не понял тебя. Попробуй /start`);
};