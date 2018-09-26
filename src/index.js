const program = require('commander')
const puppeteer = require('puppeteer')
const package = require('../package.json')
const dotenv = require('dotenv')
const { createTakeScreenshot } = require('./screenshot.js')
const { basicInfo, print } = require('./basic-info.js')

dotenv.config()

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

/**
 * now begin execution
 */

program
  .version(package.version)
  .option('-s --screenshot', 'Take Screenshot at checkpoints')

program.parse(process.argv);

(async () => {
    if (program.args.length < 1) {
        const page = await launch()
        print(
            await basicInfo({ program, page })
        )
        await page.browser().close()
    }
})()