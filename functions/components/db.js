"use strict";
//libs
//modules
const admin = require('firebase-admin');
//init
module.exports = {
    set: (path, val) => admin.database().ref(path).set(val),
    get: (path) => admin.database().ref(path).once('value').then(payload => payload.val()),
    update: (path, val) => admin.database().ref(path).update(val),
};