"use strict";
//libs
//modules
const getLastTransaction = require('../components/getLastTransaction');
const getNewTransactions = require('../components/getNewTransactions');
const sendTelegramMessage = require('../components/sendTelegramMessage');
const db = require('../components/db');
//init

const handleNewAddress = ({address}) => {
    return getLastTransaction(address).then(lastTransaction => {
        return db.update(`/watch/${address}`, {
            lastTxHash: lastTransaction.transactionHash,
            lastBlock: lastTransaction.blockNumber,
        })
    });
};
const handleExistingAddress = ({lastBlock, address, lastTxHash, name, decimals, minAmount}) => {
    return getNewTransactions({lastBlock, address, lastTxHash}).then(txns => {
        const promises = [];
        if(txns.length > 0){
            promises.push(db.update(`/watch/${address}`,{
                lastTxHash:txns[0].hash,
                lastBlock:txns[0].blockNumber,
            }))
        }
        for (let txn of txns) {
            if(txn.hash === lastTxHash) break;
            const convertedAmount = txn.amount / parseInt('1' + '0'.repeat(decimals));
            if (convertedAmount < parseFloat(minAmount)) continue;

            const text = `${convertedAmount} ${name}
${txn.from} -> ${txn.to}
${name ? `${name} ` : ''}[${address}](https://etherscan.io/address/${address}) 
[https://etherscan.io/tx/${txn.hash}](https://etherscan.io/tx/${txn.hash})`;
            promises.push(sendTelegramMessage(null, text));
        }
        return Promise.all(promises);
    })
};

module.exports = function () {
    return db.get('/watch').then(dbData => {
        const addresses = Object.keys(dbData || {});
        const promises = addresses.map(address => {
            const addressData = dbData[address];
            return addressData.lastTxHash
                ? handleExistingAddress(addressData)
                : handleNewAddress(addressData);
        });
        return Promise.all(promises);
    })
};