'use strict';

//==============================================================================
/**
*Module Variables
*/
const { getSpeed } = require('./utils/get-speed.js');


(async () => {
  // get Internet speed
  const speed = await getSpeed();
  if (speed) {
    console.log(`Current Internet Speed:${speed} Mbps`);
  }
})();