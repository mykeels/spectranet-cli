const puppeteer = require('puppeteer')
const { createTakeScreenshot } = require('./screenshot.js')
const { login } = require('./login.js')

const root = 'https://selfcare.spectranet.com.ng';

const launch = async () => {
    const browser = await puppeteer.launch({ headless: false })
    
    try {
        const page = await browser.newPage()
        const takeScreenshot = createTakeScreenshot(page)
        await page.goto(root)
        await takeScreenshot('01-login')
        await login(page)
        await takeScreenshot('02-after-login')

        page.browser = () => browser

        return page
    }
    catch (err) {
        console.error(err)
        await browser.close()
        process.exit(1)
    }
}

module.exports = launch
module.exports.launch = launch
module.exports.puppeteer = puppeteer
module.exports.login = login
module.exports.root = root
module.exports.createTakeScreenshot = createTakeScreenshot