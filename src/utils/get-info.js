const getInfo = async (page) => {
    const items = await page.evaluate(() => {
        return $('.speakout').map(function () {
            return $(this).text()
        })
    })

    const data = {
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

    return data
}

const print = ({ loginId, accountId,  lastLoginDate, dataExpirationDate,  accountBalance, 
                lastPaymentDate,  nextRenewalDate, currentDataPlan }) => {
    if (loginId) console.log('Login ID: ', loginId)
    if (accountId) console.log('Account ID: ', accountId)
    if (lastLoginDate) console.log('Last Seen: ', lastLoginDate)
    if (dataExpirationDate) console.log('Data Expires: ', dataExpirationDate)
    if (accountBalance) console.log('Account Balance: ', accountBalance)
    if (lastPaymentDate) console.log('Last Payment Date: ', lastPaymentDate)
    if (nextRenewalDate) console.log('Next Renewal Date: ', nextRenewalDate)
    if (currentDataPlan) {
        if (currentDataPlan.name) console.log('Current Data Plan: ', currentDataPlan.name)
        if (currentDataPlan.description) console.log('\t\t : ', currentDataPlan.description)
    }
}

module.exports = getInfo
module.exports.getInfo = getInfo
module.exports.print = print