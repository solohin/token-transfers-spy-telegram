module.exports = jest.fn().mockImplementation((chatId, text) => {
    if (!text) throw 'Empty message';
    return Promise.resolve();
});