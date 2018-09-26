const { puppeteer, launch, login, root } = require('./launch.js');
const { createTakeScreenshot } = require('./screenshot.js');
const url = require('url');

(async () => {
    const page = await launch()

    try {
        const takeScreenshot = createTakeScreenshot(page)
        const nextPageUrl = await page.evaluate(function () {
            return $('#myNavbar ul a').filter(function () {
                return $(this).text() == 'Payment History'
            }).attr('href')
        })

        const paymentsUrl = url.resolve(page.url(), nextPageUrl)

        await page.goto(paymentsUrl)

        await takeScreenshot('03-payments')

        await page.browser().close()
    }
    catch (err) {
        console.error('payments: ', err)

        await page.browser().close()
    }
})()