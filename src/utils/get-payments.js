const { createTakeScreenshot } = require('./screenshot.js');
const url = require('url');

const getPayments = async (page) => {
    const takeScreenshot = createTakeScreenshot(page)
    const nextPageUrl = await page.evaluate(function () {
        return $('#myNavbar ul a').filter(function () {
            return $(this).text() == 'Payment History'
        }).attr('href')
    })

    const program = typeof(page.program) == 'function' ? page.program() : {}

    const paymentsUrl = url.resolve(page.url(), nextPageUrl)

    await page.goto(paymentsUrl)

    await takeScreenshot('03-payments')

    let payments = []

    do {
        if (payments.length) {
            await page.waitForNavigation()
        }

        const pagePayments = await page.evaluate(function () {
            return $('div.table-responsive table tbody tr').map(function () {
                return $(this).find('td').map(function () {
                    return $(this).text()
                }).toArray()
            }).toArray()
        })

        payments = payments.concat(pagePayments)
    }
    while (await page.evaluate(function () {
        var $a = $('table[id].table a').filter(function () {
            return $(this).text() == 'Next'
        })
        if ($a.length > 0) {
            $a.click()
            return true
        }
        return false
    }))

    await page.browser().close()

    payments = payments.reduce((arr, item) => {
        if (!arr.length || arr[arr.length - 1].length == 4) arr.push([])
        arr[arr.length - 1].push(item)
        return arr
    }, [])

    return payments.map(p => ({
        id: p[0],
        date: p[1],
        method: p[2],
        amount: p[3]
    })).reverse()
}

const print = (payments) => {
    console.log(`id\t\tdate\t\t\tmethod\t\tamount`)

    payments.forEach(p => {
        console.log(`${p.id}\t${p.date}\t${p.method}\t${p.amount}`)
    })

    return payments
}

module.exports = getPayments
module.exports.getPayments = getPayments
module.exports.print = print