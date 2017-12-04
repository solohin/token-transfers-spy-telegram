"use strict";
const mock = jest.fn().mockImplementation(({uri, method, json, body, resolveWithFullResponse}) => {
    Promise.resolve({body: null});
});
mock.setURLs = urls => {
    mock.mockImplementation(({uri}) => {
        let body = null;
        if (urls[uri]) {
            return Promise.resolve({body: urls[uri]})
        }
        return Promise.reject({statusCode: 404});
    });
};
module.exports = mock;