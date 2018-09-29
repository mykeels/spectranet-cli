const { puppeteer, launch, login, root } = require('./utils/launch.js');
const program = require('commander')
const { getPayments, print } = require('./utils/get-payments')

program
    .option('-f, --first <count>', 'view oldest payment info')
    .option('-l, --last <count>', 'view most recent payment info')
    .option('-w, --window', 'show browser window')
    .parse(process.argv);

(async () => {
    const page = await launch({ headless: !program.window })

    page.program = () => program

    try {
        const payments = await getPayments(page)

        if (program.first) {
            print(payments.reverse().slice(0, Number(program.first) || 1))
        }
        else if (program.last) {
            print(payments.slice(0, Number(program.last) || 1))
        }
        else {
            print(payments)
        }
    }
    catch (err) {
        console.error('payments: ', err)

        await page.browser().close()
    }
})()