const fs = require('fs')
const path = require('path')

const screenshot = (filename) => path.join(__dirname, `../../screenshots${filename ? '/' : ''}${filename || ''}`)

if (!fs.existsSync(screenshot())) {
    fs.mkdirSync(screenshot())
}

const createTakeScreenshot = (page) => async (name) => {
    const path = screenshot(`${name}.png`)

    await page.screenshot({ path })

    return path
}

module.exports = screenshot

module.exports.createTakeScreenshot = createTakeScreenshot