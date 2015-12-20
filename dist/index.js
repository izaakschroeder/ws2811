'use strict';

var _gpio = require('./lib/gpio');

var _pruss = require('pruss');

var _pruss2 = _interopRequireDefault(_pruss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pru = _pruss2.default.prus[0];

var pixels = pru.l3;

var layout = [
// ## List 1
1, // 1 address in for this list
_gpio.pins.P9_22.port, _gpio.pins.P9_22.mask, pixels.address, 400, // 400 of them
// ## List 2
1, _gpio.pins.P9_24.port, _gpio.pins.P9_24.mask, pixels.address, 50, 0];

// Write the layout to the PRU dataspace
for (var i = 0; i < layout.length; ++i) {
  pru.data.writeUInt32LE(layout[i], i * 4);
}

for (var i = 0; i < 400; ++i) {
  pixels.writeUInt32LE(0, i * 4);
}

function draw() {}

_pruss2.default.on('EVTOUT0', function () {});
pru.run('./firmware/firmware.bin');