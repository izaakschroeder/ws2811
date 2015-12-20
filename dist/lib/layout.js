'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.set = set;

var _pruss = require('pruss');

var _pruss2 = _interopRequireDefault(_pruss);

var _lodash = require('lodash');

var _pins = require('./pins');

var _pins2 = _interopRequireDefault(_pins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pru = _pruss2.default.prus[0];

function get() {
  var offset = 0;
  var count = 0;
  var layout = [];

  var _loop = function _loop() {
    var port = pru.data.readUint32LE(offset + 4);
    var mask = pru.data.readUint32LE(offset + 8);
    var pin = (0, _lodash.find)(_pins2.default, function (pin) {
      return pin.port === port && pin.mask === mask;
    });
    var data = (0, _lodash.range)(count).map(function (i) {
      return {
        address: pru.data.readUint32LE(offset + 12 + i * 8),
        length: pru.data.readUint32LE(offset + 12 + i * 8 + 4)
      };
    });
    layout.push({
      pin: pin,
      data: data
    });
    offset += (3 + count * 2) * 4;
  };

  while (count = pru.data.readUint32LE(offset)) {
    _loop();
  }
  return layout;
}

function set(layout) {
  var offset = 0;
  var address = pru.l3.address;
  Object.keys(layout).forEach(function (pinId) {
    var length = layout[pinId];
    var data = [{ address: address, length: length }];
    var pin = (0, _lodash.find)(_pins2.default, function (pin) {
      return pin.key === pinId;
    });
    pru.data.writeUInt32LE(data.length, offset);
    pru.data.writeUInt32LE(pin.port, offset + 4);
    pru.data.writeUInt32LE(pin.mask, offset + 8);
    data.forEach(function (_ref, i) {
      var address = _ref.address;
      var length = _ref.length;

      pru.data.writeUInt32LE(address, offset + 12 + i * 8);
      pru.data.writeUInt32LE(length, offset + 12 + i * 8 + 4);
    });
    offset += (3 + data.length * 2) * 4;
    address += length * 4;
  });
  pru.data.writeUInt32LE(0, offset);
  return get();
}