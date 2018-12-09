'use strict';

//==============================================================================
/**
*Module Variables
*/
const { getSpeed } = require('./utils/get-speed.js');


(async () => {
  // get Network speed
  const speed = await getSpeed();
  console.log(`Current Internet Speed:${speed} Mbps`);

})();