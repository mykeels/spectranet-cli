const program = require('commander')
const puppeteer = require('puppeteer')
const package = require('./package.json')
const dotenv = require('dotenv')
const fs = require('fs')

dotenv.config()

program
  .version(package.version)

const root = 'https://selfcare.spectranet.com.ng';
const username = process.env.SPECTRANET_USERNAME;
const password = process.env.SPECTRANET_PASSWORD;

if (!fs.existsSync('./screenshots')) {
    fs.mkdirSync('./screenshots')
}

const login = async (page) => {
    await page.evaluate((username, password) => {
        $('[name="signInForm.username"]').val(username)
        $('[name="signInForm.password"]').val(password)
        $('[name="signInContainer:submit"]').click()
    }, username, password)
    await page.waitForNavigation()
}

(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const createTakeScreenshot = (page) => async (name) => await page.screenshot({ path: `./screenshots/${name}.png` })
    try {
        const page = await browser.newPage()
        const takeScreenshot = createTakeScreenshot(page)
        await page.goto(root)
        await takeScreenshot('01-login')
        await login(page)
        await takeScreenshot('02-after-login')
        await browser.close()
    }
    catch (err) {
        console.error(err)
    }
})()