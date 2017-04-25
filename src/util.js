/**
 * Created by tianwu on 2017/4/25.
 */

const hasSetImmediate = typeof window.setImmediate === 'function' && window.setImmediate;
const hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

var defer;
if (hasSetImmediate) {
  defer = window.setImmediate;
} else if (hasNextTick) {
  defer = process.nextTick;
}else{
  defer = setTimeout;
}

export default {
  defer
}