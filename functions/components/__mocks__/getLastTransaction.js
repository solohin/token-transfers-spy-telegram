module.exports = jest.fn().mockImplementation(address => new Promise((resolve, reject) => {
    return process.nextTick(() => {
        if (address === '0xTestAddress') {
            resolve({
                transactionHash: '0xNewTx',
                blockNumber: 7777
            });
        }
    });
}));


"use strict";
const mock = jest.fn().mockImplementation(({address}) => {
    return Promise.reject('no mock set');
});
mock.setData = data => {
    mock.mockImplementation(address => Promise.resolve(data[address]));
};
module.exports = mock;