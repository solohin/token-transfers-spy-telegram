module.exports = jest.fn().mockImplementation((address) => {
    if (address === '0x00c7122633a4ef0bc72f7d02456ee2b11e97561e') {
        return Promise.resolve(10);
    }
    if (address === '0x519475b31653e46d20cd09f9fdcf3b12bdacb4f5') {
        return Promise.resolve(20);
    }
    if (address === '0xab95e915c123fded5bdfb6325e35ef5515f1ea69') {
        return Promise.resolve(30);
    }
    return Promise.resolve(99);
});