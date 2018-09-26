const program = require('commander')
const puppeteer = require('puppeteer')
const package = require('../package.json')
const dotenv = require('dotenv')
const { createTakeScreenshot } = require('./screenshot.js')


dotenv.config()

program
  .version(package.version)

const root = 'https://selfcare.spectranet.com.ng';
const username = process.env.SPECTRANET_USERNAME;
const password = process.env.SPECTRANET_PASSWORD;

const login = async (page) => {
    await page.evaluate((username, password) => {
        $('[name="signInForm.username"]').val(username)
        $('[name="signInForm.password"]').val(password)
        $('[name="signInContainer:submit"]').click()
    }, username, password)
    await page.waitForNavigation()
}

const info = async (page) => {
    const items = await page.evaluate(() => {
        return $('.speakout').map(function () {
            return $(this).text()
        })
    })

    return {
        loginId: items[0],
        accountId: items[1],
        lastLoginDate: items[2],
        dataExpirationDate: items[3],
        accountBalance: items[4],
        lastPaymentDate: items[5],
        nextRenewalDate: items[6],
        currentDataPlan: {
            name: items[7],
            description: items[8]
        }
    }
}

(async () => {
    const browser = await puppeteer.launch({ headless: false })
    
    try {
        const page = await browser.newPage()
        const takeScreenshot = createTakeScreenshot(page)
        await page.goto(root)
        await takeScreenshot('01-login')
        await login(page)
        await takeScreenshot('02-after-login')
        console.log(
            await info(page)
        )
        await browser.close()
    }
    catch (err) {
        console.error(err)
        await browser.close()
        process.exit(1)
    }
})()