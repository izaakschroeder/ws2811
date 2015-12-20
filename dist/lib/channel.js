'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Channel = undefined;
exports.all = all;
exports.get = get;
exports.put = put;
exports.del = del;

var _pruss = require('pruss');

var _pruss2 = _interopRequireDefault(_pruss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pru = _pruss2.default.prus[0];

var channels = {};

// pixels = [{ pin, offset, length }, ...]

var Channel = exports.Channel = function Channel(_ref) {
  var id = _ref.id;
  var pixels = _ref.pixels;

  _classCallCheck(this, Channel);

  this.id = id;
  this.pixels = pixels;
};

function all() {
  return channels;
}

function get(id) {
  return channels[id];
}

function put(id, pixels) {
  channels[id] = new Channel({ id: id, pixels: pixels });
}

function del(id) {
  delete channels[id];
}