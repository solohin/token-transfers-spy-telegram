"use strict";
const mock = jest.fn().mockImplementation(({uri, method, json, body, resolveWithFullResponse}) => {
    return Promise.resolve({body: null});
});
mock.setURLs = urls => {
    mock.mockImplementation(({uri}) => {
        if (urls[uri]) {
            return Promise.resolve(urls[uri])
        }
        return Promise.reject({statusCode: 404});
    });
};
module.exports = mock;