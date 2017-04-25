'use strict';

exports.__esModule = true;

var _applymiddleware = require('./applymiddleware');

var _applymiddleware2 = _interopRequireDefault(_applymiddleware);

var _util = require('./util');

require('promise-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _store = {};
var _fn = [];
var middle = new _applymiddleware2.default();

//插件
var plugin = function plugin(next, action) {
  var data,
      retState,
      _this = this;

  return Promise.resolve().then(function () {
    return next(action);
  }).then(function (_resp) {
    data = _resp;

    _this.model && (_this.model.state = data);
    retState = {};

    retState[_this.model.namespace] = data;
    return retState;
  });
};
middle.use(plugin);
/**
 * 事件派送
 * @param action
 * @returns {*}
 */
var dispatch = function dispatch(action) {
  if (typeof action === 'string') {
    action = { type: action };
  }

  var _action$type$split = action.type.split('/'),
      namespace = _action$type$split[0],
      reduce = _action$type$split[1];

  if (!namespace || !reduce) {
    throw Error('action ' + action.type + ' should like "namespace/reduce"');
  }
  //中间件应用
  var model = _store[namespace];
  if (!model) {
    throw Error('can\'t find the model "' + namespace + '"');
  }
  return middle.go(function () {
    var s = model[reduce].call(model);
    //解决同步返回时的state未修改问题
    if (!s || !s.then) {
      model.state = s;
    }
    return s;
  }, {
    model: model,
    action: action
  }).then(function (data) {
    //触发 subcribe
    _fn.map(function (fn) {
      fn(data);
    });
  });
};
/**
 * model的加载
 * @param model
 * @param replace
 * @returns {boolean}
 */
var model = function model(_model2) {
  var replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


  if (!_model2) {
    console.warn('add null model: ' + _model2);
    return false;
  }
  if (typeof _model2 === 'function') {
    _model2 = new _model2();
  }

  var _model = _model2,
      namespace = _model.namespace;

  if (!namespace) {
    console.warn('It is not a model: ' + _model2);
    return false;
  }

  if (!replace && _store[namespace]) {
    console.warn('Have use this model before: ' + _model2);
    return false;
  }
  /**
   * model 触发 dispath;
   * @param action
   */
  _model2.dispatch = function (action) {
    if (typeof action === 'string') {
      var type = namespace + '/' + action;
      action = { type: type };
    } else {
      var _action = action,
          _type = _action.type;

      if (_type) {
        action.type = namespace + '/' + _type;
      }
    }
    return dispatch(action);
  };
  _store[namespace] = _model2;
  //model 触发事件调用
  if (typeof _model2.bootstrap === 'function') {
    (0, _util.defer)(_model2.bootstrap.bind(_model2));
  }
};

var subscribe = function subscribe(fn) {
  if (typeof fn !== 'function') {
    throw new Error('first argument of subcribe should be a function');
  }
  _fn.push(fn);
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