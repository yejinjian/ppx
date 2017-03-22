'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by tianwu on 2017/3/17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Connect = function (_React$Component) {
  _inherits(Connect, _React$Component);

  function Connect(props) {
    _classCallCheck(this, Connect);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    var filter = props.filter,
        Store = props.Store;

    _this.Store = Store;

    var models = typeof filter == 'function' ? filter(Store._store) : Store._store;
    console.log(Store._store);
    var state = {};
    for (var i in models) {
      state[i] = models[i].state;
    }
    _this.state = state;
    return _this;
  }

  Connect.prototype.dispatch = function dispatch(action) {
    var _this2 = this;

    return this.Store.dispatch(action).then(function (data) {
      var filter = _this2.props.filter;
      data = filter ? filter(data) : data;
      _this2.setState(data);
    });
  };

  Connect.prototype.render = function render() {
    var View = this.props.View;

    var state = _objectWithoutProperties(this.state, []);

    return _react2.default.createElement(View, _extends({ dispatch: this.dispatch.bind(this) }, state));
  };

  return Connect;
}(_react2.default.Component);

exports.default = function (filter) {
  return function (View) {
    return function () {
      return _react2.default.createElement(Connect, { Store: _store2.default, View: View, filter: filter });
    };
  };
};

module.exports = exports['default'];