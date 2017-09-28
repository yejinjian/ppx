'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Middleware = function () {
  function Middleware() {
    _classCallCheck(this, Middleware);

    this.middlewares = [];
  }

  /**
    *
   * @param next
   * @param data
   * @returns {*}
   */


  Middleware.prototype.go = function go(next, data) {
    return next(data);
  };

  /**
    * 中间件封装
   * @param middlewares
   * @returns {Middleware}
   */


  Middleware.prototype.use = function use() {
    var _this = this;

    for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
      middlewares[_key] = arguments[_key];
    }

    middlewares.map(function (middleware) {
      if (typeof middleware !== 'function') {
        return false;
      }
      _this.middlewares.push(middleware);
      _this.go = function (stack) {
        return function (next, data) {
          return stack(function () {
            return middleware.call(data.model, next.bind(data.model), data.action);
          }, data);
        };
      }(_this.go);
    });
    return this;
  };

  return Middleware;
}();

exports.default = Middleware;
module.exports = exports['default'];