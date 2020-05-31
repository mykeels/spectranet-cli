const { puppeteer, launch, login, root } = require('./utils/launch.js');
const { createTakeScreenshot } = require('./utils/screenshot.js');
const url = require('url');
const program = require('commander')
const { getUsage, printHistory, printSummary } = require('./utils/get-usage.js')

program
    .option('-f, --from <from>', 'from date in DD-MM-YYYY format')
    .option('-t, --to <to>', 'to date in DD-MM-YYYY format')
    .option('-w, --window', 'show browser window')
    .parse(process.argv);

(async () => {
    const page = await launch({ headless: !program.window })

    try {
        const { from, to } = program
        const { history, summary } = await getUsage(page, { from, to })

        printSummary(summary)
        printHistory(history)
    }
    catch (err) {
        console.error('usage: ', err)

        await page.browser().close()
    }
})()