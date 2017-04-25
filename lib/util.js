'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Created by tianwu on 2017/4/25.
 */

var hasSetImmediate = typeof window.setImmediate === 'function' && window.setImmediate;
var hasNextTick = (typeof process === 'undefined' ? 'undefined' : _typeof(process)) === 'object' && typeof process.nextTick === 'function';

var defer;
if (hasSetImmediate) {
  defer = window.setImmediate;
} else if (hasNextTick) {
  defer = process.nextTick;
} else {
  defer = setTimeout;
}

exports.default = {
  defer: defer
};
module.exports = exports['default'];