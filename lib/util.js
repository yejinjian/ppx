'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Created by tianwu on 2017/4/25.
 */

var hasSetImmediate = typeof window.setImmediate === 'function' && window.setImmediate;
var hasNextTick = (typeof process === 'undefined' ? 'undefined' : _typeof(process)) === 'object' && typeof process.nextTick === 'function';

var defer = void 0;
if (hasSetImmediate) {
    defer = window.setImmediate;
} else if (hasNextTick) {
    defer = process.nextTick;
} else {
    defer = setTimeout;
}

/**
 * 引用自 https://github.com/bfollington/react-es7-mixin/blob/master/util/mergeMethods.js
 * @param target
 * @param name
 * @param fn
 * @param reverseOrder
 */
function mergeMethods(target, name, fn, reverseOrder) {
    if (target[name] !== undefined) {
        var one = target[name];
        var two = fn;

        if (one && two) {
            target[name] = function () {

                if (reverseOrder === true) {
                    return two.call(this, arguments) || one.call(this, arguments);
                } else {
                    return one.call(this, arguments) || two.call(this, arguments);
                }
            };

            target[name].__isMergedMethod = true;
        }
    } else {
        target[name] = fn;
    }
};

exports.default = {
    defer: defer,
    mergeMethods: mergeMethods
};
module.exports = exports['default'];