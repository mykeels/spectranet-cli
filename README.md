# Spectranet CLI (In Development)

This is an unofficial CLI tool for accessing Spectranet user account data from its web portal.

![Spectranet CLI Usage Preview](https://user-images.githubusercontent.com/11996508/46118338-f10f5280-c1fd-11e8-800d-53a55002b9d1.png)

## Installation

```sh
yarn global add spectranet-cli
```

or

```sh
npm i -g spectranet-cli
```

## Dependencies

- You will need to have Google Chrome installed to use this. This program should automatically detect the file path to your Chrome executable, however you can override it by specifying the `CHROME_EXECUTABLE_PATH` env variable. e.g. `CHROME_EXECUTABLE_PATH="/path/to/chrome" spectranet-cli`

## Usage as NPM Module

```js
const spectranet = require('spectranet-cli')

spectranet.info().then(info => {
    console.log('my basic spectranet info', info)
})

spectranet.payments().then(payments => {
    console.log('my spectranet payments', payments)
})

spectranet.usage().then(records => {
    console.log('my usage history', records)
})
```

You can specify `username` and `password` either by setting the `SPECTRANET_USERNAME` and `SPECTRANET_PASSWORD` env variables respectively, or by using the `spectranet.config({ username, password })` method.

## Usage as CLI Tool

- Get Basic Info

```bash
spectranet-cli
```

- Get Payments Info

```bash
spectranet-cli payments
    -f, --first <count>  view oldest payment info
    -l, --last <count>   view most recent payment info
```

To get first 3 payments, use `spectranet-cli payments -f 3` or `spectranet-cli payments --first 3`

- Get Data Usage Info

```bash
spectranet-cli usage
    -f, --from <from>  from date in DD-MM-YYYY format
    -t, --to <to>      to date in DD-MM-YYYY format
```

To specify the starting/from date as `26-09-2018`, use

```bash
spectranet-cli usage -f 26-09-2018
```

or

```bash
spectranet-cli usage --from 26-09-2018
```