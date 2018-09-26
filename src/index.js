const program = require('commander')
const package = require('../package.json')
const { basicInfo, print } = require('./basic-info.js')
const { puppeteer, launch, login, root } = require('./launch.js')

/**
 * now begin execution
 */

program
    .version(package.version)
    .option('-s --screenshot', 'take screenshot at checkpoints')

program
    .command('info [env]', 'displays basic information', { isDefault: true })

program
    .command('payments [env]', 'handles payments')
    .option('-l --list', 'lists all payments')
    .option('-r --recent', 'view most recent payment info')

program.parse(process.argv);