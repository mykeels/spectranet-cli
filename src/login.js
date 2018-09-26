const dotenv = require('dotenv')

dotenv.config()

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

module.exports = login
module.exports.login = login