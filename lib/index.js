'use strict';

exports.__esModule = true;

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

var _provider = require('./provider');

var _provider2 = _interopRequireDefault(_provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_store2.default.connect = _connect2.default; /**
                                              * Created by tianwu on 2017/3/22.
                                              */

_store2.default.Provider = _provider2.default;
exports.default = _store2.default;
module.exports = exports['default'];