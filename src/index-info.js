const { basicInfo, print } = require('./basic-info.js')
const { puppeteer, launch, login, root } = require('./launch.js');

(async () => {
    const page = await launch()
    print(
        await basicInfo(page)
    )
    await page.browser().close()
})()