'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _levelup = require('levelup');

var _levelup2 = _interopRequireDefault(_levelup);

var _leveldown = require('leveldown');

var _leveldown2 = _interopRequireDefault(_leveldown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = (0, _levelup2.default)('/var/lib/ws2811/db', {
  keyEncoding: 'utf8',
  valueEncoding: 'json',
  db: _leveldown2.default
});

exports.default = db;