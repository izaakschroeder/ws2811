'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pin = exports.pins = undefined;

var _fs = require('fs');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GPIO = [0x44E07000, 0x4804c000, 0x481AC000, 0x481AE000];

var pins = exports.pins = [{
  key: 'P9_11',
  gpio: 30
}, {
  key: 'P9_12',
  gpio: 60
}, {
  key: 'P9_13',
  gpio: 31
}, {
  key: 'P9_14',
  gpio: 50
}, {
  key: 'P9_15',
  gpio: 48
}, {
  key: 'P9_16',
  gpio: 51
}, {
  key: 'P9_17',
  gpio: 5
}, {
  key: 'P9_18',
  gpio: 4
}, {
  key: 'P9_19',
  gpio: 13
}, {
  key: 'P9_20',
  gpio: 12
}, {
  key: 'P9_21',
  gpio: 3
}, {
  key: 'P9_22',
  gpio: 2
}, {
  key: 'P9_23',
  gpio: 49
}, {
  key: 'P9_24',
  gpio: 15
}];

var Pin = exports.Pin = (function () {
  function Pin(_ref) {
    var key = _ref.key;
    var gpio = _ref.gpio;

    _classCallCheck(this, Pin);

    this.key = key;
    this.gpio = gpio;
  }

  _createClass(Pin, [{
    key: 'port',
    get: function get() {
      return GPIO[Math.floor(this.gpio / 32)];
    }
  }, {
    key: 'mask',
    get: function get() {
      return 1 << this.gpio % 32;
    }
  }, {
    key: 'direction',
    get: function get() {
      return (0, _fs.readFileSync)('/sys/class/gpio/gpio' + this.gpio + '/direction', 'utf8');
    },
    set: function set(direction) {
      if (direction !== 'in' && direction !== 'out') {
        throw new TypeError('Invalid direction.');
      }
      (0, _fs.writeFileSync)('/sys/class/gpio/gpio' + this.gpio + '/direction', 'utf8', direction);
    }
  }, {
    key: 'value',
    get: function get() {
      return parseInt((0, _fs.readFileSync)('/sys/class/gpio/gpio' + this.gpio + '/value', 'utf8'), 10);
    },
    set: function set(value) {
      (0, _fs.writeFileSync)('/sys/class/gpio/gpio' + this.gpio + '/value', 'utf8', value);
    }
  }]);

  return Pin;
})();

exports.default = pins.map(Pin);