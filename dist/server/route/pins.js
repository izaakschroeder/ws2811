'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _gpio = require('../../lib/gpio');

var _gpio2 = _interopRequireDefault(_gpio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = new _express.Router();

routes.get('/', function (req, res) {
  res.send(_gpio2.default);
});

exports.default = routes;