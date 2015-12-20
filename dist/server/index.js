'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _layout = require('./route/layout');

var _layout2 = _interopRequireDefault(_layout);

var _channel = require('./route/channel');

var _channel2 = _interopRequireDefault(_channel);

var _pins = require('./route/pins');

var _pins2 = _interopRequireDefault(_pins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use('/layout', _layout2.default);
app.use('/channel', _channel2.default);
app.use('/pins', _pins2.default);

app.listen(process.env.PORT || 8080);