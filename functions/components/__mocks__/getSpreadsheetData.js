module.exports = jest.fn().mockImplementation((tableId, range) => {
    if (tableId.length < 10) throw 'Looks like it is not a tableId';
    if (range === encodeURIComponent('Токены') + '!A1:C') {
        return [
            ['0x00c7122633a4-ef0bc72f7d02456ee2b11e97561e', 'RDN 50m', '50 000 000',],
            ['wrong address', 'RDN', '50 000',],
            ['0x519475b31653e46d20cd09f9fdcf3b12bdacb4f5', 'VIU ten', '10.00',],
            ['0xab95e915c123fde d5bdfb6325e35ef5515f1ea69', 'XENON 1.12m', '1,120,000',],
        ];
    }
});