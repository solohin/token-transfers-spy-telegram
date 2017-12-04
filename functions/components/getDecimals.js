"use strict";
//libs
const request = require('request-promise');
//modules
//init

module.exports = function (address) {
    return request({
        uri: `https://api.ethplorer.io/getTokenInfo/${address}?apiKey=freekey`,
        method: 'GET',
        json: true,
        resolveWithFullResponse: true
    }).then(response => {
        if (response.statusCode >= 400) {
            throw new Error(`Could not send message to ${subscriber}: ${response.body}`);
        }
        return parseInt(response.body.decimals);
    })
};