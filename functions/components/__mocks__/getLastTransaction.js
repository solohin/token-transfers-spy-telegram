"use strict";
const mock = jest.fn().mockImplementation(({address}) => {
    return Promise.reject('no mock set');
});
mock.setData = data => {
    mock.mockImplementation(address => Promise.resolve(data[address]));
};
module.exports = mock;