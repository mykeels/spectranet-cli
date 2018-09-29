const locateChrome = require('locate-chrome')

module.exports = async () => {
    const executablePath = process.env.CHROME_EXECUTABLE_PATH || (await locateChrome())
    
    if (!executablePath) {
        throw new Error('cannot find chrome executable path ... please specify CHROME_EXECUTABLE_PATH env variable')
    }

    return executablePath
}