const { getInfo, print } = require('./utils/get-info.js')
const { puppeteer, launch, login, root } = require('./utils/launch.js');
const program = require('commander')

program
    .option('-w, --window', 'show browser window')
    .parse(process.argv);

(async () => {
    const page = await launch({ headless: !program.window })
    print(
        await getInfo(page)
    )
    await page.browser().close()
})()