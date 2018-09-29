require('dotenv').config()
const { assert } = require('chai')
const spectranet = require('../src/spectranet-cli.js')

describe('usage', () => {
    it('should respond with usage history', () => {
        spectranet.usage().then(records => {
            assert.isArray(records)
        })
    })
})