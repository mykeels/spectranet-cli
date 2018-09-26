const { basicInfo, print } = require('./basic-info.js')
const { puppeteer, launch, login, root } = require('./launch.js');
const program = require('commander')

program
    .option('-w, --window', 'show browser window')
    .parse(process.argv);

(async () => {
    const page = await launch({ headless: !program.window })
    print(
        await basicInfo(page)
    )
    await page.browser().close()
})()