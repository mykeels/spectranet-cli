/**
 * Spectranet CLI is an unofficial command-line interface for accessing spectranet user account data
 */

const program = require('commander')

// define sub commands

program
    .version('0.0.1')
    .command('info [env]', 'displays basic information', { isDefault: true })
    .command('payments [env]', 'displays payment history')
    .command('usage [env]', 'displays usage histories')
    .parse(process.argv);