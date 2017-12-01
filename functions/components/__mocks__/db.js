"use strict";
//libs
//modules
//init

const calls = {
    set: [],
    get: [],
    update: [],
};

const mocksOriginals = {
    set: () => Promise.resolve(),
    update: () => Promise.resolve(),
    get: () => Promise.resolve({some: 'data'})
};

let mocks = {};

module.exports = {
    set: function (path, val) {
        calls['set'].push(arguments);
        return mocks['set'](path, val);
    },
    get: function (path) {
        calls['get'].push(arguments);
        return mocks['get'](path);
    },
    update: function (path, val) {
        calls['update'].push(arguments);
        return mocks['update'](path, val);
    },
    __mock: function (method, func) {
        return mocks[method] = func;
    },
    __getCalls: function (method) {
        return calls[method];
    },
    __reset: function (method) {
        Object.keys(calls).map(key => {
            calls[key] = [];
        });
        mocks = Object.assign({}, mocksOriginals);
    }
};