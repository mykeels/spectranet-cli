const fs = require('fs')
const path = require('path')

const screenshot = (filename) => path.join(__dirname, `../screenshots${filename ? '/' : ''}${filename}`)

if (!fs.existsSync(screenshot())) {
    fs.mkdirSync(screenshot())
}

const createTakeScreenshot = (page) => async (name) => await page.screenshot({ path: screenshot(`${name}.png`) })

module.exports = screenshot

module.exports.createTakeScreenshot = createTakeScreenshot