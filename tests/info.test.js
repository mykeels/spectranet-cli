require('dotenv').config()
const { assert } = require('chai')
const spectranet = require('../src/spectranet-cli.js')

describe('info', () => {
    it('should respond with info', () => {
        return spectranet.info().then(info => {
            assert.typeOf(info, 'object')
            assert.equal(info.loginId, process.env.SPECTRANET_USERNAME)
        })
    })
})