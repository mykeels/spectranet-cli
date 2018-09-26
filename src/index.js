const program = require('commander')
const package = require('../package.json')
const { basicInfo, print } = require('./basic-info.js')
const { puppeteer, launch, login, root } = require('./launch.js')

/**
 * now begin execution
 */

program
    .version(package.version)
    .command('info [env]', 'displays basic information', { isDefault: true })
    .command('payments [env]', 'handles payments')
    .parse(process.argv);