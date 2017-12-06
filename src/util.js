/**
 * Created by tianwu on 2017/4/25.
 */

const hasSetImmediate = typeof window.setImmediate === 'function' && window.setImmediate;
const hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

let defer;
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
        const one = target[name];
        const two = fn;

        if (one && two) {
            target[name] = function() {

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

export default {
    defer,
    mergeMethods
};