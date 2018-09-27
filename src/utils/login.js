const dotenv = require('dotenv')
const readline = require('readline-sync')

dotenv.config()

const login = async (page) => {
    let username = process.env.SPECTRANET_USERNAME;
    let password = process.env.SPECTRANET_PASSWORD;

    if (!username) {
        username = readline.question('Enter Username: ')
    }

    if (!password) {
        password = readline.question('Enter Password: ', { hideEchoBack: true })
        console.log('-------------------------')
    }
    
    await page.evaluate((username, password) => {
        $('[name="signInForm.username"]').val(username)
        $('[name="signInForm.password"]').val(password)
        $('[name="signInContainer:submit"]').click()
    }, username, password)
    await page.waitForNavigation()
}

module.exports = login
module.exports.login = login