'use strict';

//==============================================================================
/**
*Module Dependencies
*/

const FastSpeedTest = require('fast-speedtest-api');

//Create FastSpeedTest instance
const speedTest = new FastSpeedTest({
  token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
  verbose: false,
  timeout: 10000,
  https: true,
  urlCount: 5,
  bufferSize: 8,
  unit: FastSpeedTest.UNITS.Mbps
});

//==============================================================================
/**
 * Fetches User's Current Internet speed 
 * @param  none
 * @return {Number} return user's network speed in Mbps unit
 */

const getSpeed = async() => {
  try {
    const speed = await speedTest.getSpeed();
    return speed;
  }
  catch(error) {
    console.error(`Speed:${error.message}`);
  }
}

//==============================================================================
/**
*Export Module
*/
module.exports = getSpeed;
module.exports.getSpeed = getSpeed;


