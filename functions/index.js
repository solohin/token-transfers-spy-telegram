//libs
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const objectValues = require('object.values');
//modules
const onMessage = require('./components/onMessage');
const doWatch = require('./handlers/doWatch');
//init
objectValues.shim();

admin.initializeApp(functions.config().firebase);

exports.telegramWebhook = functions.https.onRequest((request, response) => {
    const text = request.body.message.text;
    const chatId = request.body.message.chat.id;
    console.log(functions.config());
    console.log(`Got message from @${request.body.message.chat.username}: ${text}`);
    return onMessage(chatId, text).then(() => {
        response.send("ok");
    });
});

exports.doWatch = functions.https.onRequest((request, response) => {
    return doWatch().then(() => {
        response.send("ok");
    });
});

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise', p);
    console.error('Unhandled Rejection at: Reason', reason);
    // application specific logging, throwing an error, or other logic here
});
