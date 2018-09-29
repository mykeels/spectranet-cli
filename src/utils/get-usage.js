const { createTakeScreenshot } = require('./screenshot.js');
const url = require('url');
const moment = require('moment')

const getUsage = async (page, opts) => {
    opts = opts || {}
    const takeScreenshot = createTakeScreenshot(page)
    const nextPageUrl = await page.evaluate(function () {
        return $('#myNavbar ul a').filter(function () {
            return $(this).text() == 'Usage History'
        }).attr('href')
    })

    const paymentsUrl = url.resolve(page.url(), nextPageUrl)

    await page.goto(paymentsUrl)

    await takeScreenshot('04-usage')

    const fromDate = moment(opts.from || moment().subtract(30, 'days'), 'DD-MM-YYYY').format('DD-MM-YYYY')
    const toDate = moment(opts.to || new Date(), 'DD-MM-YYYY').format('DD-MM-YYYY')

    await page.evaluate(function (fromDate, toDate) {
        $('#fromDate').val(fromDate)
        $('#toDate').val(toDate)
        $('[name=":submit"]').click()
    }, fromDate, toDate)

    let history = []

    do {
        await page.waitForNavigation()

        await page.evaluate(function () {
            $('div.table-responsive table tbody')[0].scrollIntoView()
        })

        await takeScreenshot('05-usage-page')

        const pageHistory = await page.evaluate(function () {
            
            return $('div.table-responsive table tbody tr').map(function () {
                return $(this).find('td').map(function () {
                    return $(this).text()
                }).toArray()
            }).toArray().slice(1)
        })

        history = history.concat(pageHistory)
    }
    while (await page.evaluate(function () {
        var $a = $('a.paginate_enabled_next.submit_btn').filter(function () {
            return $(this).text() == ' Next'
        })
        if ($a.length > 0) {
            $a.click()
            return true
        }
        return false
    }))

    await page.browser().close()

    history = history.reduce((arr, item) => {
        if (!arr.length || arr[arr.length - 1].length == 7) arr.push([])
        arr[arr.length - 1].push(item)
        return arr
    }, [])

    let sumTotal = 0

    history = history.reverse().map(p => {
        const dataSection = (p[5].match(/\d+\:\d+\:\d+/i) || [])[0] || ''

        const nums = dataSection.split(':')

        nums[0] = Number(nums[0]) * 1024 * 1024
        nums[1] = Number(nums[1]) * 1024
        nums[2] = Number(nums[2])

        const dataUsedKB = nums.reduce((a, b) => a + b)

        sumTotal += Number(dataUsedKB) || 0

        const gb = Math.floor(sumTotal / 1024 / 1024)
        const mb = Math.floor(sumTotal / 1024) % 1024
        const kb = sumTotal % 1024

        return {
            ipAddress: p[0],
            startTime: p[1],
            endTime: p[2],
            dataDuration: p[3],
            callDuration: p[4],
            dataUsed: p[5],
            dataUsedKB,
            totalDataUsed: `${gb}:${mb}:${kb} (GB:MB:KB)`,
            totalDataUsedKB: sumTotal,
            serviceType: p[6]
        }
    })

    return history.reverse()
}

const print = (records) => {
    console.log(`ip_address\tstart\t\t\tduration\tdata_used\t\ttotal`)

    return records.map(p => {
        console.log(`${p.ipAddress}\t${p.startTime}\t${p.dataDuration}\t${p.dataUsed.split(' : ').slice(-1)[0] || '0:0:0 (GB:MB:KB)'}\t${p.totalDataUsed}`)
        return p
    })
}

module.exports = getUsage
module.exports.getUsage = getUsage
module.exports.print = print