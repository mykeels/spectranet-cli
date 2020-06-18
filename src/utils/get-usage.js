const { createTakeScreenshot } = require('./screenshot.js');
const url = require('url');
const moment = require('moment');

const formatData = val => {
    const gb = Math.floor(val / 1024 / 1024)
    const mb = Math.floor(val / 1024) % 1024
    const kb = val % 1024
    return `${gb}:${mb}:${kb} (GB:MB:KB)`
}

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
            return $('form div.table-responsive table tbody tr').toArray()
                .map(el => (
                    $(el).find('td').toArray()
                        .map(el => $(el).text())
                )).filter(history => history.length)
        })

        history = [...history, ...pageHistory];
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

    let sumTotal = 0

    const summary = {}
    history = history.reverse().map(p => {
        const dataSection = (p[5].match(/\d+\:\d+\:\d+/i) || [])[0] || ''
        const serviceType = p[5].split(":")[0].trim();

        const nums = dataSection.split(':')

        nums[0] = Number(nums[0]) * 1024 * 1024
        nums[1] = Number(nums[1]) * 1024
        nums[2] = Number(nums[2])

        const dataUsedKB = nums.reduce((a, b) => a + b)

        sumTotal += Number(dataUsedKB) || 0

        if (serviceType) {
            if (!summary[serviceType]) summary[serviceType] = 0
            summary[serviceType] += dataUsedKB
        }

        return {
            ipAddress: p[0],
            startTime: p[1],
            endTime: p[2],
            dataDuration: p[3],
            callDuration: p[4],
            dataUsed: p[5],
            dataUsedKB,
            totalDataUsed: formatData(sumTotal),
            totalDataUsedKB: sumTotal,
            serviceType: p[6]
        }
    })
    return {
        history,
        summary,
    }
}

const groupByDay = records => { 
    const dataByDay = {}
    records.forEach(record => {
        const day = record.startTime.split(' ')[0]
        if (!dataByDay[day]) dataByDay[day] = 0 
        dataByDay[day]+= isNaN(record.dataUsedKB) ? 0 : +record.dataUsedKB 
    })
    return dataByDay
}

const printHistory = (records) => {
    console.log(`start\t\t\tduration\tdata_used\t\ttotal`)

    return records.map(p => {
        console.log(`${p.startTime}\t${p.dataDuration}\t${p.dataUsed.split(' : ').slice(-1)[0] || '0:0:0 (GB:MB:KB)'}\t${p.totalDataUsed}`)
        return p
    })
}

const printSummary = (summary) => {
    console.log("Data Usage Summary")
    console.log('_'.padEnd(55, '_'))

    for (serviceType in summary) {
        if (!summary[serviceType]) console
        console.log(`${serviceType.padEnd(20, ' ')}\t\t${formatData(summary[serviceType])}`)
    }
    console.log('_'.padEnd(55, '_'))
    console.log()
}

const printGraph = (records) => {
    const dailyUsage = groupByDay(records)
    const availTerminalWidth = (process.stdout.columns - 30) * .8
    const minUsage = Math.min(...Object.values(dailyUsage))
    const maxUsage = Math.max(...Object.values(dailyUsage))
    const range = maxUsage - minUsage;
    const shouldStartFromZero = minUsage < range;
    let offset = 0
    let multiplier = maxUsage / availTerminalWidth
    if (!shouldStartFromZero) {
        offset = 3
        multiplier = range / availTerminalWidth
    }
    for (day in dailyUsage) {
        usage = dailyUsage[day]
        printBar(day, dailyUsage[day], multiplier, offset)
    }
    console.log()
}

const printBar = (day, usage, multiplier, offset) => {
    const barLength = Math.floor(offset + (usage / multiplier))
    const bar = Array(barLength).fill('▇').join('')
    console.log(`${day} | ${bar} ${formatData(usage)}`)
}

module.exports = getUsage
module.exports.getUsage = getUsage
module.exports.printHistory = printHistory
module.exports.printSummary = printSummary
module.exports.printGraph = printGraph
