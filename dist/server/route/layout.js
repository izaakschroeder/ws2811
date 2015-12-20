'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _bodyParser = require('body-parser');

var _layout = require('../../lib/layout');

var routes = new _express.Router();

routes.use((0, _bodyParser.json)());

routes.get('/', function (req, res) {
  res.status(200).send((0, _layout.get)());
});

routes.post('/', function (req, res) {
  res.status(200).send((0, _layout.set)(req.body));
});

routes.param('pin', function (req, res, next, id) {
  var layout = (0, _layout.get)();
  req.pin = layout[id];
  next();
});

routes.patch('/:pin', function (req, res) {});

routes.put('/:pin', function (req, res) {
  var pin = req.pin;
  for (var i = 0; i < req.body.length; ++i) {
    pin.data.writeUInt32LE(req.body[i], i * 4);
  }
  res.send(200);
});

routes.get('/:pin', function (req, res) {
  res.send(req.pin.data);
});

exports.default = routes;