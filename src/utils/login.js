const dotenv = require('dotenv')
const readline = require('readline-sync')
const { saveDetails, deleteDetails } = require('./save-details.js')

dotenv.config()

const login = async (page, save, logout) => {
    if (logout) {
        await deleteDetails()
    }

    let username = process.env.SPECTRANET_USERNAME;
    let password = process.env.SPECTRANET_PASSWORD;
    const alreadySaved = !!(password && username)

    if (!username) {
        username = readline.question('Enter Username: ')
    }

    if (!password) {
        password = readline.question('Enter Password: ', { hideEchoBack: true })
        console.log('-------------------------')
    }
    
    if (save && !alreadySaved) {
        saveDetails(username, password)
        console.log('Details saved')
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