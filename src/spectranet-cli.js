#!/usr/bin/env node

/**
 * Spectranet CLI is an unofficial command-line interface for accessing spectranet user account data
 */

const { launch } = require('./utils/launch.js');
const { getInfo } = require('./utils/get-info')
const { getPayments } = require('./utils/get-payments')
const { getUsage } = require('./utils/get-usage')

// define sub commands

if (require.main === module) {
    const program = require('commander')

    program
        .version('1.0.3')
        .command('info [env]', 'displays basic information', { isDefault: true })
        .command('payments [env]', 'displays payment history')
        .command('usage [env]', 'displays usage histories')
        .parse(process.argv);
}

module.exports = {
    config: ({ username, password }) => {
        if (username) process.env.SPECTRANET_USERNAME = username
        if (password) process.env.SPECTRANET_PASSWORD = password
        return this
    },
    async info (opts) {
        this.config(opts = opts || {})

        const page = await launch({ headless: opts.headless })

        const info = await getInfo(page)
        
        await page.browser().close()

        return info
    },
    async payments (opts) {
        this.config(opts = opts || {})

        const page = await launch({ headless: opts.headless })

        const payments = await getPayments(page)
        
        await page.browser().close()

        return payments
    },
    async usage(opts) {
        this.config(opts = opts || {})

        const page = await launch({ headless: opts.headless })

        const records = await getUsage(page)
        
        await page.browser().close()

        return records
    }
}