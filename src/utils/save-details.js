const fs = require('fs');
const path = require('path')

const ENV_PATH = path.resolve(__dirname, '../../.env')

const createCredentials = (username, password) => {
  return `SPECTRANET_USERNAME=${username}\nSPECTRANET_PASSWORD=${password}`
} 

const deleteDetails = () => {
  return new Promise((resolve) => {
    fs.unlink(ENV_PATH, resolve)
  })
} 

const saveDetails = (username, password) => {
  const data = createCredentials(username, password)
  return new Promise((resolve) => {
    fs.writeFile(ENV_PATH, data, resolve)
  })
}

module.exports = saveDetails;
module.exports.saveDetails = saveDetails;
module.exports.deleteDetails = deleteDetails;
