const puppeteer = require('puppeteer-core')
const { createTakeScreenshot } = require('./screenshot.js')
const { login } = require('./login.js')
const locateChrome = require('./locate-chrome.js')

const root = 'https://selfcare.spectranet.com.ng';

const launch = async ({ headless, save, logout }) => {
    const executablePath = await locateChrome()
    const browser = await puppeteer.launch({ headless, executablePath })
    
    try {
        const page = await browser.newPage()
        const takeScreenshot = createTakeScreenshot(page)
        await page.goto(root)
        await takeScreenshot('01-login')
        await login(page, save, logout)
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