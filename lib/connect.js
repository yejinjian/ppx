'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * Created by tianwu on 2017/3/17.
                                                                                                                                                                                                                                                                   */

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _provider = require('./provider');

var _provider2 = _interopRequireDefault(_provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (models) {
    return function (View) {
        return function (props) {
            return _react2.default.createElement(
                _provider2.default,
                _extends({ models: models }, props),
                _react2.default.createElement(View, null)
            );
        };
    };
};

module.exports = exports['default'];