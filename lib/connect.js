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

/**
 * 目前只包了react版本
 */
var Connect = function (_React$Component) {
	_inherits(Connect, _React$Component);

	function Connect(props) {
		_classCallCheck(this, Connect);

		var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

		var filter = props.filter;

		_this.Store = _store2.default;

		var models = typeof filter === 'function' ? filter(_store2.default._store) : _store2.default._store;
		var state = {};
		for (var i in models) {
			state[i] = models[i].state;
		}
		_this.state = state;
		_this.subscribe();
		return _this;
	}

	/**
  * 监听store 变化
  */


	Connect.prototype.subscribe = function subscribe() {
		var _this2 = this;

		this.Store.subscribe(function (data) {
			var filter = _this2.props.filter;

			data = filter ? filter(data) : data;
			if (data) {
				_this2.setState(data);
			}
		});
	};

	Connect.prototype.dispatch = function dispatch(action) {
		return this.Store.dispatch(action);
	};

	Connect.prototype.render = function render() {
		var _props = this.props,
		    View = _props.View,
		    filter = _props.filter,
		    children = _props.children,
		    others = _objectWithoutProperties(_props, ['View', 'filter', 'children']);

		var state = _objectWithoutProperties(this.state, []);

		return _react2.default.createElement(View, _extends({ dispatch: this.dispatch.bind(this) }, state, others));
	};

	return Connect;
}(_react2.default.Component);

exports.default = function (filter) {
	return function (View) {
		return function (props) {
			return _react2.default.createElement(Connect, _extends({}, props, { View: View, filter: filter }));
		};
	};
};

module.exports = exports['default'];