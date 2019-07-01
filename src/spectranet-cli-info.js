const { getInfo, print } = require('./utils/get-info.js')
const { puppeteer, launch, login, root } = require('./utils/launch.js');
const program = require('commander')

program
    .option('-w, --window', 'show browser window')
    .option('-s, --save', 'save login details')
    .option('-l, --logout', 'delete previously saved login details')
    .parse(process.argv);

(async () => {
    const page = await launch({
        headless: !program.window,
        save: !!program.save,
        logout: !!program.logout
    })
    print(
        await getInfo(page)
    )
    await page.browser().close()
})()