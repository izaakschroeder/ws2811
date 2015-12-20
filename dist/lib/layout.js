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
  var offset = 8;
  var count = pru.data.readUInt32LE(0);
  var base = pru.data.readUInt32LE(4);
  var layout = {};

  var _loop = function _loop(i) {
    var port = pru.data.readUInt32LE(offset);
    var mask = pru.data.readUInt32LE(offset + 4);
    var start = pru.data.readUInt32LE(offset + 8);
    var length = pru.data.readUInt32LE(offset + 12);
    var pin = (0, _lodash.find)(_pins2.default, function (pin) {
      return pin.port === port && pin.mask === mask;
    });
    if (!pin) {
      throw new Error('Invalid layout state; no matching pin: ' + pin + '.');
    }
    layout[pin.key] = {
      pin: pin,
      data: pru.l3.slice(start, start + length * 4)
    };
    offset += 16;
  };

  for (var i = 0; i < count; ++i) {
    _loop(i);
  }
  return {
    pins: layout,
    length: count,
    base: base
  };
}

function set(layout) {
  var offset = 8;
  var address = 0;
  var keys = Object.keys(layout);
  pru.data.writeUInt32LE(keys.length, 0);
  pru.data.writeUInt32LE(pru.l3.address, 4);
  keys.forEach(function (pinId) {
    var length = layout[pinId];
    var pin = (0, _lodash.find)(_pins2.default, function (pin) {
      return pin.key === pinId;
    });
    if (!pin) {
      throw new Error('No such pin: ' + pinId + '.');
    }
    pin.direction = 'out';
    pru.data.writeUInt32LE(pin.port, offset + 0);
    pru.data.writeUInt32LE(pin.mask, offset + 4);
    pru.data.writeUInt32LE(address, offset + 8);
    pru.data.writeUInt32LE(length, offset + 12);
    offset += 16;
    address += length * 4;
  });

  return get();
}