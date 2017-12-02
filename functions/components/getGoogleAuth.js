"use strict";
//libs
const google = require('googleapis');
//modules
const key = require('../google_service_account.json');
//init

const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/spreadsheets'], // an array of auth scopes
    null
);

let auth = null;
let error = null;

jwtClient.authorize(function (err, tokens) {
    if (err) {
        error = err;
        console.error('Error in spreadsheetClient.getAuth', err);
        return;
    }

    auth = jwtClient;
});

module.exports = function () {
    if (auth !== null) {
        return Promise.resolve(auth);
    } else if (error !== null) {
        return Promise.reject(error);
    }

    return new Promise((resolve, reject) => {
        const interval = setInterval(function () {
            if (auth !== null) {
                clearInterval(interval);
                resolve(auth);
            } else if (error !== null) {
                clearInterval(interval);
                reject(error);
            }
        }, 100);
    })
}