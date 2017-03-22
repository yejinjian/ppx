'use strict';

exports.__esModule = true;

var _applymiddleware = require('./applymiddleware');

var _applymiddleware2 = _interopRequireDefault(_applymiddleware);

require('promise-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _store = {};
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

exports.default = {
  middle: middle,
  _store: _store,
  /**
   * model的加载
   * @param model
   * @param replace
   * @returns {boolean}
   */
  model: function model(_model) {
    var replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!_model) {
      console.warn('add null model: ' + _model);
      return false;
    }
    if (typeof _model === 'function') {
      _model = new _model();
    }
    var _model2 = _model,
        namespace = _model2.namespace;

    if (!namespace) {
      console.warn('It is not a model: ' + _model);
      return false;
    }
    if (!replace && _store[namespace]) {
      console.warn('Have use this model before: ' + _model);
      return false;
    }
    _store[namespace] = _model;
  },
  /**
   * 插件加载
   * @param middlewares
   */
  use: function use() {
    middle.use.apply(middle, arguments);
  },
  /**
   * 事件派送
   * @param action
   * @returns {*}
   */
  dispatch: function dispatch(action) {
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
    return middle.go(model[reduce].bind(model), {
      model: model,
      action: action
    });
  }
};
module.exports = exports['default'];