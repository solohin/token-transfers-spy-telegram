"use strict";
//libs
//modules
const sendTelegramMessage = require('../components/sendTelegramMessage');
const db = require('../components/db');
const isAdmin = require('../components/isAdmin');
const config = require('../config');
//init

const ADMIN_TEXT = `Привет! 
Я слежу за крупными операциями с ERC-20 токенами. 
Ты в списке админов, можешь управлять списком токенов для отслеживания. 
Токены для отслеживания запиши во вкладку "Токены" таблицы https://docs.google.com/spreadsheets/d/${config.tableID}/edit#gid=0
В первый столбец записывай список токенов, во второй - имена, в третий - минимальную сумму для отслеживания.
Каждый раз как обновишь Google-таблицу, набирай команду /update`;

const USER_TEXT = `Привет! 
Я слежу за крупными операциями с ERC-20 токенами. 
Ты подписан, следи за обновлениями.`;

module.exports = function (chatId) {
    const dbPromise = db.set(`/listeners/${chatId}`, 1);
    const messagePromise = sendTelegramMessage(chatId, isAdmin(chatId) ? ADMIN_TEXT : USER_TEXT);
    return Promise.all([dbPromise, messagePromise]);
};