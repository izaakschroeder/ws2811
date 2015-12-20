'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _channel = require('../../lib/channel');

var _channel2 = _interopRequireDefault(_channel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = new _express.Router();

routes.get('/', function (req, res) {
  res.send(_channel2.default.all());
});

routes.get('/:channel', function (req, res) {});

routes.get('/:channel/state', function (req, res) {});

routes.put('/:channel', function (req, res) {});

routes.put('/:channel/state', function (req, res) {});

exports.default = routes;