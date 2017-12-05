"use strict";
let stubData = {};
const mock = jest.fn().mockImplementation(({lastBlock, address, lastTxHash}) => {
    if (stubData[address] && stubData[address][lastBlock] && stubData[address][lastBlock][lastTxHash]) {
        return Promise.resolve(stubData[address][lastBlock][lastTxHash]);
    }
    const debugData = {
        dataset: data,
        params: [lastBlock, address, lastTxHash],
    };
    return Promise.reject('no mock set getNewTransactions\n' + JSON.stringify(debugData, null, 2));
});
mock.clearData = () => {
    stubData = {};
};
mock.addData = ({lastBlock, address, lastTxHash}, gotData) => {
    stubData[address] = stubData[address] || {};
    stubData[address][lastBlock] = stubData[address][lastBlock] || {};
    stubData[address][lastBlock][lastTxHash] = gotData;
};
module.exports = mock;