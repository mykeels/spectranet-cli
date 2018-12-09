const { assert } = require('chai')
const spectranet = require('../src/spectranet-cli.js')

describe('speed', () => {
    it('should respond with current internet speed', () => {
        spectranet.speed().then(speed => {
            assert.include(speed, 'Mbps');
        })
    })
})