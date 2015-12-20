'use strict';

var _pruss = require('pruss');

var _pruss2 = _interopRequireDefault(_pruss);

var _layout = require('./lib/layout');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pru = _pruss2.default.prus[0];

var res = (0, _layout.set)({
  P9_24: 500
});

var pixels = res.P9_24.data;

for (var i = 0; i < pixels.length / 4; ++i) {
  pixels.writeUInt32LE(0x00FF0000, i * 4);
}

console.log(res);

pru.run('./firmware/firmware.bin');