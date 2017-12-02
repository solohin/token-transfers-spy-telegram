"use strict";
//libs
//modules
const config = require('../config');
const getSpreadsheetData = require('../components/getSpreadsheetData');
const sendTelegramMessage = require('../components/sendTelegramMessage');
const db = require('../components/db');
const isAddress = require('../components/isAddress');
//init
module.exports = function (chatId, text) {
    const oldWalletsPromise = db.get('/watch');
    const sheetDataPromise = getSpreadsheetData(config.tableID, encodeURIComponent('Токены') + 'A1:C');
    return Promise.all([oldWalletsPromise, sheetDataPromise]).then(([dbData, sheetData]) => {
        let toDelete = Object.keys(dbData);
        const toUpdate = {};
        for (let sheetRow of sheetData) {
            const address = (sheetRow[0] || '').replace(/[^0-9a-zA-Z\.]+/g, '');
            const name = (sheetRow[1] || '').trim();
            const minAmount = Math.round(
                parseFloat(
                    (sheetRow[2] || '').replace(/[^0-9\.]+/g, '')
                )
            );
            if (!isAddress(address)) {
                continue;
            }
            //убрать из списка на удаление
            toDelete = toDelete.filter(addressToDelete => addressToDelete !== address);
            //обновить
            toUpdate[address] = {address, minAmount, name};
        }

        const deletePromises = toDelete.map(addressToDelete => db.set(`/watch/${addressToDelete}`, null));
        const updatePromises = Object.keys(toUpdate).map(address => db.update(`/watch/${address}`, toUpdate[address]));

        //сообщение
        let message = `Всего на отслеживании токенов: ${updatePromises.length}\n`;
        message += Object.keys(toUpdate).map(address => {
            const name = toUpdate[address].name;
            return `- [${address}](https://etherscan.io/address/${address}) ${ name ? `(${name})` : ''}`
        }).join('\n');
        const messagePromise = sendTelegramMessage(chatId, message);

        return Promise.all(deletePromises.concat(updatePromises).concat([messagePromise]));
    });
};