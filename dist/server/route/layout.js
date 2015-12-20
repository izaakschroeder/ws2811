'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _bodyParser = require('body-parser');

var _layout = require('../../lib/layout');

var _layout2 = _interopRequireDefault(_layout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = new _express.Router();

routes.use((0, _bodyParser.json)());

routes.get('/', function (req, res) {
  res.status(200).send(_layout2.default.get());
});

routes.post('/', function (req, res) {
  res.status(200).send(_layout2.default.set(req.body));
});

exports.default = routes;