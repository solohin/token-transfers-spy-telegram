"use strict";
//libs
const google = require('googleapis');
//modules
const getAuth = require('./getGoogleAuth');
//init
const sheets = google.sheets('v4');

module.exports = function (spreadsheetId, range) {
    return new Promise((resolve, reject) => {
        getAuth().then(auth => {
            sheets.spreadsheets.values.get({
                auth: auth,
                spreadsheetId,
                range: range,
            }, function (err, response) {
                if (err) {
                    console.error('The API returned an error: ' + err);
                    reject(err);
                    return;
                }
                const rows = response.values;
                resolve(rows.map(row =>
                    row.map(cell => (typeof cell === 'string') ? cell.trim() : cell)
                ));
            });
        });
    })
}