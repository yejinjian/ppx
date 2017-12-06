'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('promise-polyfill');

var _applymiddleware = require('./applymiddleware');

var _applymiddleware2 = _interopRequireDefault(_applymiddleware);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _store = {};
var _fn = [];
var middle = new _applymiddleware2.default();

//插件用于数据save与返回promise
var plugin = function plugin(next, action) {
    var ret,
        state,
        _this = this;

    return Promise.resolve().then(function () {
        return next(action);
    }).then(function (_resp) {
        ret = _resp;
        state = _this.state;

        if (!(ret === undefined)) {
            _this.state = _extends(state, ret);
            // 修改值
            triggerSubscribe(action, ret);
            return ret;
        }
    });
};
middle.use(plugin);

/**
 * 触发 subscribe
 * @param action
 * @param ret
 */
var triggerSubscribe = function triggerSubscribe(action, ret) {
    var retState = {};

    var _action$type$split = action.type.split('/'),
        namespace = _action$type$split[0],
        reduce = _action$type$split[1];

    retState[namespace] = ret;
    //触发 subscribe
    console.log("mid", _fn);
    _fn.map(function (fn) {
        fn(action, retState);
    });
};

/**
 *
 * @param namespace
 * @returns {function(*=, ...[*])}
 * @private
 */
var _addDispatch = function _addDispatch(namespace) {
    return function (action) {
        for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            params[_key - 1] = arguments[_key];
        }

        if (typeof action === 'string') {
            var type = namespace + '/' + action;
            action = { type: type, params: params };
        } else {
            var _action = action,
                _type = _action.type;

            if (_type) {
                action.type = namespace + '/' + _type;
            }
        }
        return dispatch.apply(undefined, [action].concat(params));
    };
};

/**
 * 事件派送
 * @param action
 * @param params //当action 是字符串时被使用
 * @returns {Promise.<TResult>|PromiseLike<T>}
 */
var dispatch = function dispatch(action) {
    for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        data[_key2 - 1] = arguments[_key2];
    }

    //兼容字符串
    if (typeof action === 'string') {
        action = { type: action, data: data };
    }
    var _action2 = action,
        type = _action2.type;

    var _type$split = type.split('/'),
        namespace = _type$split[0],
        reduce = _type$split[1];

    if (!namespace || !reduce) {
        throw Error('action ' + type + ' should like "namespace/reduce"');
    }
    //中间件应用
    var model = _store[namespace];
    if (!model) {
        throw Error('can\'t find the model "' + namespace + '"');
    }
    return middle.go(function (action) {
        var type = action.type;

        var _type$split2 = type.split('/'),
            namespace = _type$split2[0],
            reduce = _type$split2[1];

        return this[reduce].call(this, model.state, action);
    }, {
        model: model,
        action: action
    });
};

/**
 * model的加载
 * @param model
 * @param replace
 * @returns {boolean}
 */
var model = function model(Model) {
    var replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!Model) {
        console.warn('add null model: ' + Model);
        return false;
    }
    var model = Model;
    if (typeof Model === 'function') {
        model = new Model();
    }

    // namespace
    var _model = model,
        namespace = _model.namespace,
        constructor = _model.constructor;

    if (constructor && constructor.name) {
        namespace = constructor.name;
    }
    if (!namespace) {
        throw new Error('It is not a model: ' + model);
    }

    if (!replace && _store[namespace]) {
        console.warn('Have use this model before: ' + model);
        return false;
    }
    // save namespace;
    model.namespace = namespace;
    // 不鼓励在model中使用dispatch 但是想来会有复杂需求使用到
    model.dispatch = _addDispatch(namespace);
    // save
    _store[namespace] = model;
    // model 触发事件调用 不鼓励使用
    if (typeof model.bootstrap === 'function') {
        _util2.default.defer(model.bootstrap.bind(model));
    }
};

/**
 * 监听dispatch
 * @param fn
 */
var subscribe = function subscribe(fn) {
    if (typeof fn !== 'function') {
        throw new Error('first argument of subcribe should be a function');
    }
    var isSubscribed = true;
    _fn.push(fn);
    return function () {
        if (!isSubscribed) {
            return;
        }
        isSubscribed = false;
        var index = _fn.indexOf(fn);
        _fn.splice(index, 1);
    };
};

/**
 * 插件加载
 * @param middlewares
 */
var use = function use() {
    middle.use.apply(middle, arguments);
};

exports.default = {
    middle: middle,
    _store: _store,
    model: model,
    dispatch: dispatch,
    subscribe: subscribe,
    use: use
};
module.exports = exports['default'];