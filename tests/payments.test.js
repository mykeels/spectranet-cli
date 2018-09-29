require('dotenv').config()
const { assert } = require('chai')
const spectranet = require('../src/spectranet-cli.js')

describe('payments', () => {
    it('should respond with array of payments', () => {
        spectranet.payments().then(payments => {
            assert.isArray(payments)
        })
    })
})